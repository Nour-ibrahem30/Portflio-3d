import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { organizeProjects, applyProjectOverrides, isNewProject } from '../utils/projectUtils';
import { projectsConfig, getProjectOverride } from '../config/projectsConfig';

gsap.registerPlugin(ScrollTrigger);

// ── LocalStorage cache so we don't hit GitHub's unauthenticated rate limits ──
const CACHE_KEY = 'portfolio_projects_v3';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours
const RATE_LIMIT_KEY = 'github_api_rate_limited';
const RATE_LIMIT_COOLDOWN = 15 * 60 * 1000; // 15 mins default cooldown

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    return { data, age: Date.now() - ts };
  } catch { return null; }
}

function setCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

function checkRateLimited() {
  try {
    const limitTime = localStorage.getItem(RATE_LIMIT_KEY);
    if (!limitTime) return false;
    if (Date.now() > parseInt(limitTime, 10)) {
      localStorage.removeItem(RATE_LIMIT_KEY);
      return false;
    }
    return true;
  } catch { return false; }
}

function setRateLimited(resetTimestamp) {
  try {
    // If GitHub provides a reset timestamp in headers, use it; otherwise default to 15 min cooldown
    const resetTime = resetTimestamp 
      ? parseInt(resetTimestamp, 10) * 1000 
      : Date.now() + RATE_LIMIT_COOLDOWN;
    localStorage.setItem(RATE_LIMIT_KEY, resetTime.toString());
  } catch {}
}

// ── Rate-limited batch fetch (max 5 concurrent) ──
async function batchFetch(items, fetcher, concurrency = 5) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map(fetcher));
    results.push(...chunkResults);
  }
  return results;
}

export default function ProjectsSectionEnhanced() {
  const [allProjects, setAllProjects] = useState({ featured: [], other: [], archived: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(projectsConfig.display.defaultTab);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [displayCount, setDisplayCount] = useState(projectsConfig.display.projectsPerPage);
  const [techFilter, setTechFilter] = useState('All');
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchProjects = async () => {
      // 1. Check if we are currently rate-limited (to avoid 403 network errors in console)
      const isRateLimited = checkRateLimited();
      
      // 2. Try to get cached data
      const cached = getCached();
      
      // 3. Decide whether we can use cache immediately
      if (cached) {
        const isFresh = cached.age < CACHE_TTL;
        if (isRateLimited || isFresh) {
          console.log(isRateLimited 
            ? '🚀 GitHub API rate limit active, using cached portfolio data' 
            : '🚀 Using fresh cached portfolio data'
          );
          setAllProjects(cached.data);
          setLoading(false);
          return;
        }
      } else if (isRateLimited) {
        console.warn('⚠️ GitHub API rate limit active and no cached data available. Falling back to static data.');
        throw new Error('GitHub API rate limited (cooldown active)');
      }

      try {
        const headers = { 'Accept': 'application/vnd.github.v3+json' };
        const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
        
        let reposResponse;
        let usingToken = false;

        let repos = [];

        // Try authenticated request first if token is available
        if (githubToken) {
          try {
            console.log('📡 Attempting authenticated GitHub API fetch...');
            const authHeaders = { 
              ...headers, 
              'Authorization': `token ${githubToken}` 
            };
            
            let page = 1;
            const perPage = 100;
            let hasMore = true;
            let reposList = [];

            while (hasMore) {
              reposResponse = await fetch(
                `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&type=owner`,
                { headers: authHeaders }
              );

              if (reposResponse.ok) {
                usingToken = true;
                const pageRepos = await reposResponse.json();
                reposList = [...reposList, ...pageRepos];
                if (pageRepos.length < perPage) {
                  hasMore = false;
                } else {
                  page++;
                }
              } else {
                console.warn(`⚠️ Authenticated fetch failed (status ${reposResponse.status}). Falling back to unauthenticated public fetch...`);
                if (reposResponse.status === 403 || reposResponse.status === 429) {
                  const reset = reposResponse.headers.get('x-ratelimit-reset');
                  setRateLimited(reset);
                }
                hasMore = false;
              }
            }
            
            if (usingToken) {
              repos = reposList;
              console.log('✅ Authenticated GitHub API fetch successful');
            }
          } catch (tokenError) {
            console.warn('⚠️ Error during authenticated fetch:', tokenError.message);
          }
        }

        // If no token or authenticated request failed, fall back to public endpoints without token
        if (!usingToken) {
          // Double check rate limit flag before public fetch
          if (checkRateLimited()) {
            throw new Error('Skipping public fetch: Rate limit cooldown active');
          }

          console.log('📡 Fetching public repositories from GitHub...');
          if (headers['Authorization']) {
            delete headers['Authorization'];
          }
          
          let page = 1;
          const perPage = 100;
          let hasMore = true;
          let reposList = [];

          while (hasMore) {
            reposResponse = await fetch(
              `https://api.github.com/users/Nour-ibrahem30/repos?per_page=${perPage}&page=${page}`,
              { headers }
            );

            if (reposResponse.ok) {
              const pageRepos = await reposResponse.json();
              reposList = [...reposList, ...pageRepos];
              if (pageRepos.length < perPage) {
                hasMore = false;
              } else {
                page++;
              }
            } else {
              if (reposResponse.status === 403 || reposResponse.status === 429) {
                const reset = reposResponse.headers.get('x-ratelimit-reset');
                setRateLimited(reset);
              }
              throw new Error(`GitHub API error: ${reposResponse.status}`);
            }
          }
          repos = reposList;
        }
        const ownRepos = repos.filter(repo => !repo.fork);

        // Add local projects
        const localProjects = [];
        Object.keys(projectsConfig.overrides).forEach(projectName => {
          const override = projectsConfig.overrides[projectName];
          if (override.isLocalProject) {
            localProjects.push({
              id: `local-${projectName}`,
              name: projectName,
              full_name: `local/${projectName}`,
              description: override.customDescription || '',
              html_url: override.liveUrl || '#',
              homepage: override.liveUrl || '#',
              stargazers_count: 0,
              forks_count: 0,
              language: override.tags?.[0] || 'Media',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              default_branch: 'main',
            });
          }
        });

        const allRepos = [...localProjects, ...ownRepos];
        
        // ── Batch fetch — max 5 concurrent to respect rate limits ──
        const projectsWithData = await batchFetch(allRepos, async (repo) => {
            let description = repo.description || 'No description available';
            let projectImage = null;
            
            // Handle local projects
            const override = getProjectOverride(repo.name);
            if (override?.isLocalProject) {
              const mediaPath = override.localMediaPath || '';
              // Use first image or video thumbnail from local folder
              projectImage = `${mediaPath}/2.jpg`;
              description = override.customDescription || description;
              
              return {
                ...repo,
                readme: description,
                projectImage: projectImage
              };
            }
            
            // Use local image if available in overrides (PRIORITY)
            if (override?.projectImage) {
              projectImage = override.projectImage;
              description = override.customDescription || description;
              console.log(`📸 Using local image for ${repo.name}:`, projectImage);
              
              return {
                ...repo,
                readme: description,
                projectImage: projectImage
              };
            }

            // Skip readme fetch if we just got rate-limited by a previous fetch
            if (checkRateLimited()) {
              const isFeatured = projectsConfig.featured.includes(repo.name);
              projectImage = isFeatured 
                ? `https://opengraph.githubassets.com/1/${repo.full_name}`
                : 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 800 600%27%3E%3Cdefs%3E%3ClinearGradient id=%27grad%27 x1=%270%25%27 y1=%270%25%27 x2=%270%25%27 y2=%27100%25%27%3E%3Cstop offset=%270%25%27 style=%27stop-color:%231e293b;stop-opacity:1%27 /%3E%3Cstop offset=%27100%25%27 style=%27stop-color:%230f172a;stop-opacity:1%27 /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%27800%27 height=%27600%27 fill=%27url(%23grad)%27/%3E%3Cg transform=%27translate(400,300)%27%3E%3Ccircle cx=%270%27 cy=%270%27 r=%27120%27 fill=%27%23cbd5e1%27 opacity=%270.1%27/%3E%3Cpath d=%27M-40,-20 L-40,20 L0,40 L40,20 L40,-20 L0,-40 Z%27 fill=%27%23cbd5e1%27 opacity=%270.8%27/%3E%3Ccircle cx=%270%27 cy=%27-10%27 r=%2715%27 fill=%27%23475569%27/%3E%3Cpath d=%27M-25,10 Q0,30 25,10%27 stroke=%27%23475569%27 stroke-width=%273%27 fill=%27none%27/%3E%3C/g%3E%3Ctext x=%27400%27 y=%27480%27 font-family=%27Arial,sans-serif%27 font-size=%2724%27 fill=%27%2364748b%27 text-anchor=%27middle%27%3EJAVASCRIPT%3C/text%3E%3C/svg%3E';
              return {
                ...repo,
                readme: description,
                projectImage: projectImage
              };
            }
            
            try {
              const readmeResponse = await fetch(
                `https://api.github.com/repos/Nour-ibrahem30/${repo.name}/readme`,
                { headers }
              );
              
              if (readmeResponse.ok) {
                const readmeData = await readmeResponse.json();
                const binaryString = atob(readmeData.content);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                const readmeContent = new TextDecoder('utf-8').decode(bytes);
                
                // Extract description
                const lines = readmeContent.split('\n');
                let meaningfulText = '';
                
                for (const line of lines) {
                  const trimmed = line.trim();
                  if (trimmed && 
                      !trimmed.startsWith('#') && 
                      !trimmed.startsWith('!') &&
                      !trimmed.startsWith('[!') &&
                      !trimmed.startsWith('[![') &&
                      !trimmed.startsWith('```') &&
                      !trimmed.startsWith('---') &&
                      !trimmed.startsWith('|') &&
                      !trimmed.startsWith('>') &&
                      trimmed.length > 20) {
                    meaningfulText += trimmed + ' ';
                    if (meaningfulText.length > 150) break;
                  }
                }
                
                if (meaningfulText.length > 20) {
                  description = meaningfulText.substring(0, 150).trim() + '...';
                }
                
                // Find images - try multiple patterns
                const imageRegex = /!\[.*?\]\((.*?)\)/g;
                const images = [...readmeContent.matchAll(imageRegex)];
                
                // Also try to find direct image URLs
                const urlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))/gi;
                const directImages = [...readmeContent.matchAll(urlRegex)];
                
                if (images.length > 0) {
                  let imgUrl = images[0][1];
                  // Clean up the URL (remove quotes, spaces, etc.)
                  imgUrl = imgUrl.trim().replace(/['"]/g, '');
                  
                  if (!imgUrl.startsWith('http')) {
                    // Handle relative paths
                    imgUrl = `https://raw.githubusercontent.com/Nour-ibrahem30/${repo.name}/${repo.default_branch}/${imgUrl}`;
                  }
                  projectImage = imgUrl;
                } else if (directImages.length > 0) {
                  // Use first direct image URL found
                  projectImage = directImages[0][1];
                }
              } else {
                if (readmeResponse.status === 403 || readmeResponse.status === 429) {
                  const reset = readmeResponse.headers.get('x-ratelimit-reset');
                  setRateLimited(reset);
                }
              }
              
              // Fallback to default project image for "other" projects
              if (!projectImage) {
                // Check if this is a featured project
                const isFeatured = projectsConfig.featured.includes(repo.name);
                if (isFeatured) {
                  // Use GitHub OpenGraph for featured projects without custom image
                  projectImage = `https://opengraph.githubassets.com/1/${repo.full_name}`;
                } else {
                  // Use default image for other projects
                  projectImage = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 800 600%27%3E%3Cdefs%3E%3ClinearGradient id=%27grad%27 x1=%270%25%27 y1=%270%25%27 x2=%270%25%27 y2=%27100%25%27%3E%3Cstop offset=%270%25%27 style=%27stop-color:%231e293b;stop-opacity:1%27 /%3E%3Cstop offset=%27100%25%27 style=%27stop-color:%230f172a;stop-opacity:1%27 /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%27800%27 height=%27600%27 fill=%27url(%23grad)%27/%3E%3Cg transform=%27translate(400,300)%27%3E%3Ccircle cx=%270%27 cy=%270%27 r=%27120%27 fill=%27%23cbd5e1%27 opacity=%270.1%27/%3E%3Cpath d=%27M-40,-20 L-40,20 L0,40 L40,20 L40,-20 L0,-40 Z%27 fill=%27%23cbd5e1%27 opacity=%270.8%27/%3E%3Ccircle cx=%270%27 cy=%27-10%27 r=%2715%27 fill=%27%23475569%27/%3E%3Cpath d=%27M-25,10 Q0,30 25,10%27 stroke=%27%23475569%27 stroke-width=%273%27 fill=%27none%27/%3E%3C/g%3E%3Ctext x=%27400%27 y=%27480%27 font-family=%27Arial,sans-serif%27 font-size=%2724%27 fill=%27%2364748b%27 text-anchor=%27middle%27%3EJAVASCRIPT%3C/text%3E%3C/svg%3E';
                }
              }
              
            } catch (error) {
              console.log(`Could not fetch data for ${repo.name}`);
              // Use default image for other projects, GitHub OpenGraph for featured
              const isFeatured = projectsConfig.featured.includes(repo.name);
              if (isFeatured) {
                projectImage = `https://opengraph.githubassets.com/1/${repo.full_name}`;
              } else {
                projectImage = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 800 600%27%3E%3Cdefs%3E%3ClinearGradient id=%27grad%27 x1=%270%25%27 y1=%270%25%27 x2=%270%25%27 y2=%27100%25%27%3E%3Cstop offset=%270%25%27 style=%27stop-color:%231e293b;stop-opacity:1%27 /%3E%3Cstop offset=%27100%25%27 style=%27stop-color:%230f172a;stop-opacity:1%27 /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%27800%27 height=%27600%27 fill=%27url(%23grad)%27/%3E%3Cg transform=%27translate(400,300)%27%3E%3Ccircle cx=%270%27 cy=%270%27 r=%27120%27 fill=%27%23cbd5e1%27 opacity=%270.1%27/%3E%3Cpath d=%27M-40,-20 L-40,20 L0,40 L40,20 L40,-20 L0,-40 Z%27 fill=%27%23cbd5e1%27 opacity=%270.8%27/%3E%3Ccircle cx=%270%27 cy=%27-10%27 r=%2715%27 fill=%27%23475569%27/%3E%3Cpath d=%27M-25,10 Q0,30 25,10%27 stroke=%27%23475569%27 stroke-width=%273%27 fill=%27none%27/%3E%3C/g%3E%3Ctext x=%27400%27 y=%27480%27 font-family=%27Arial,sans-serif%27 font-size=%2724%27 fill=%27%2364748b%27 text-anchor=%27middle%27%3EJAVASCRIPT%3C/text%3E%3C/svg%3E';
              }
            }
            
            return {
              ...repo,
              readme: description,
              projectImage: projectImage
            };
        });

        // Apply overrides and organize
        const projectsWithOverrides = projectsWithData.map(applyProjectOverrides);
        const organized = organizeProjects(projectsWithOverrides);

        // ── Save to cache ──
        setCache(organized);

        setAllProjects(organized);
        setLoading(false);
      } catch (err) {
        // Fallback to static data
        const localProjects = [];
        Object.keys(projectsConfig.overrides).forEach(projectName => {
          const override = projectsConfig.overrides[projectName];
          if (override.isLocalProject) {
            localProjects.push({
              id: `local-${projectName}`,
              name: projectName,
              full_name: `local/${projectName}`,
              description: override.customDescription || '',
              html_url: override.liveUrl || '#',
              homepage: override.liveUrl || '#',
              stargazers_count: 0,
              forks_count: 0,
              language: override.tags?.[0] || 'Media',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              default_branch: 'main',
            });
          }
        });
        
        // Add static projects as fallback
        const staticFallbackProjects = [
                {
                          "id": "amrpro-fallback",
                          "name": "AMRPro",
                          "full_name": "Nour-ibrahem30/AMRPro",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/AMRPro",
                          "homepage": "https://amr-pro.vercel.app",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2026-02-22T18:26:59Z",
                          "updated_at": "2026-02-22T19:16:49Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "career-pilot-ai--fallback",
                          "name": "Career-Pilot-AI-",
                          "full_name": "Nour-ibrahem30/Career-Pilot-AI-",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Career-Pilot-AI-",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "TypeScript",
                          "created_at": "2026-06-10T12:54:18Z",
                          "updated_at": "2026-06-10T13:27:12Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "chain-app-fallback",
                          "name": "Chain-App",
                          "full_name": "Nour-ibrahem30/Chain-App",
                          "description": "Html, css",
                          "html_url": "https://github.com/Nour-ibrahem30/Chain-App",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-01-23T09:02:52Z",
                          "updated_at": "2025-06-14T20:05:51Z",
                          "default_branch": "main",
                          "readme": "Html, css"
                },
                {
                          "id": "creative-child-fallback",
                          "name": "Creative-child",
                          "full_name": "Nour-ibrahem30/Creative-child",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Creative-child",
                          "homepage": "https://creative-child.vercel.app",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "JavaScript",
                          "created_at": "2026-01-07T22:17:31Z",
                          "updated_at": "2026-01-14T16:53:16Z",
                          "default_branch": "main",
                          "projectImage": "/Featured_Projects/creative-child.jpg",
                          "readme": ""
                },
                {
                          "id": "cyborg-gaming-fallback",
                          "name": "Cyborg-Gaming",
                          "full_name": "Nour-ibrahem30/Cyborg-Gaming",
                          "description": "Html, css Template",
                          "html_url": "https://github.com/Nour-ibrahem30/Cyborg-Gaming",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-02-07T16:05:09Z",
                          "updated_at": "2025-05-18T14:01:15Z",
                          "default_branch": "main",
                          "readme": "Html, css Template"
                },
                {
                          "id": "e-commerce-fallback",
                          "name": "E-Commerce",
                          "full_name": "Nour-ibrahem30/E-Commerce",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/E-Commerce",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "SCSS",
                          "created_at": "2025-09-01T18:16:11Z",
                          "updated_at": "2025-09-09T17:30:27Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "elevate-academy-fallback",
                          "name": "Elevate-Academy",
                          "full_name": "Nour-ibrahem30/Elevate-Academy",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Elevate-Academy",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-06-26T13:07:17Z",
                          "updated_at": "2025-06-26T13:12:14Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "elgokh-fallback",
                          "name": "Elgokh",
                          "full_name": "Nour-ibrahem30/Elgokh",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Elgokh",
                          "homepage": "https://fdk2.vercel.app",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2026-01-31T14:13:23Z",
                          "updated_at": "2026-03-01T13:59:22Z",
                          "default_branch": "main",
                          "projectImage": "/Featured_Projects/elgokh.jpg",
                          "readme": ""
                },
                {
                          "id": "family-fallback",
                          "name": "Family",
                          "full_name": "Nour-ibrahem30/Family",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Family",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2025-09-23T09:14:08Z",
                          "updated_at": "2026-02-08T22:52:03Z",
                          "default_branch": "main",
                          "projectImage": "/Featured_Projects/family.jpg",
                          "readme": ""
                },
                {
                          "id": "guess-the-words-fallback",
                          "name": "Guess-the-words",
                          "full_name": "Nour-ibrahem30/Guess-the-words",
                          "description": "A light word guessing game based on thinking and intelligence, specially designed for simplicity and interactive use using HTML, CSS and JavaScript.",
                          "html_url": "https://github.com/Nour-ibrahem30/Guess-the-words",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "JavaScript",
                          "created_at": "2025-06-04T17:29:29Z",
                          "updated_at": "2025-06-05T17:19:17Z",
                          "default_branch": "main",
                          "readme": "A light word guessing game based on thinking and intelligence, specially designed for simplicity and interactive use using HTML, CSS and JavaScript."
                },
                {
                          "id": "hangman-fallback",
                          "name": "Hangman",
                          "full_name": "Nour-ibrahem30/Hangman",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Hangman",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-06-07T09:09:03Z",
                          "updated_at": "2025-06-07T09:18:40Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "intiative_website_value-fallback",
                          "name": "intiative_Website_Value",
                          "full_name": "Nour-ibrahem30/intiative_Website_Value",
                          "description": "Vakue intiative Website",
                          "html_url": "https://github.com/Nour-ibrahem30/intiative_Website_Value",
                          "homepage": "https://intiative-website-value.vercel.app",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-12-18T15:58:14Z",
                          "updated_at": "2026-02-08T22:44:41Z",
                          "default_branch": "main",
                          "projectImage": "/Featured_Projects/value-marketing.jpg",
                          "readme": "Vakue intiative Website"
                },
                {
                          "id": "jadoo-fallback",
                          "name": "jadoo",
                          "full_name": "Nour-ibrahem30/jadoo",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/jadoo",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-07-10T16:12:24Z",
                          "updated_at": "2025-07-10T16:22:01Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "kalaly-project-fallback",
                          "name": "Kalaly-Project",
                          "full_name": "Nour-ibrahem30/Kalaly-Project",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Kalaly-Project",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-07-27T17:20:10Z",
                          "updated_at": "2025-07-27T17:29:12Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "kasper-fallback",
                          "name": "Kasper",
                          "full_name": "Nour-ibrahem30/Kasper",
                          "description": "Html, css",
                          "html_url": "https://github.com/Nour-ibrahem30/Kasper",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-01-12T08:12:35Z",
                          "updated_at": "2025-01-12T08:20:04Z",
                          "default_branch": "main",
                          "readme": "Html, css"
                },
                {
                          "id": "leon-fallback",
                          "name": "Leon",
                          "full_name": "Nour-ibrahem30/Leon",
                          "description": "Html, css",
                          "html_url": "https://github.com/Nour-ibrahem30/Leon",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-01-12T08:22:29Z",
                          "updated_at": "2025-01-12T08:24:41Z",
                          "default_branch": "main",
                          "readme": "Html, css"
                },
                {
                          "id": "liberty-market-fallback",
                          "name": "Liberty-Market",
                          "full_name": "Nour-ibrahem30/Liberty-Market",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Liberty-Market",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-03-26T14:37:07Z",
                          "updated_at": "2025-03-26T14:40:09Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "login-register-system-fallback",
                          "name": "Login-Register-System",
                          "full_name": "Nour-ibrahem30/Login-Register-System",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Login-Register-System",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2025-08-04T21:00:05Z",
                          "updated_at": "2026-02-09T10:20:31Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "memory-game-fallback",
                          "name": "Memory-Game",
                          "full_name": "Nour-ibrahem30/Memory-Game",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Memory-Game",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2025-06-24T15:15:22Z",
                          "updated_at": "2025-06-24T16:02:28Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "movie-app-fallback",
                          "name": "Movie-App",
                          "full_name": "Nour-ibrahem30/Movie-App",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Movie-App",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2025-08-08T14:53:49Z",
                          "updated_at": "2025-08-08T15:12:13Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "new-portfolio-fallback",
                          "name": "New-Portfolio",
                          "full_name": "Nour-ibrahem30/New-Portfolio",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/New-Portfolio",
                          "homepage": "https://new-portfolio-two-ashen.vercel.app",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2025-10-20T15:47:27Z",
                          "updated_at": "2025-12-20T19:35:49Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "nour-ibrahem30-fallback",
                          "name": "Nour-ibrahem30",
                          "full_name": "Nour-ibrahem30/Nour-ibrahem30",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Nour-ibrahem30",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2025-07-15T20:05:00Z",
                          "updated_at": "2025-09-02T07:56:35Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "portflio-3d-fallback",
                          "name": "Portflio-3d",
                          "full_name": "Nour-ibrahem30/Portflio-3d",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Portflio-3d",
                          "homepage": "https://nouribrahem.vercel.app",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "JavaScript",
                          "created_at": "2026-02-08T17:17:27Z",
                          "updated_at": "2026-06-20T21:44:15Z",
                          "default_branch": "main",
                          "projectImage": "/Featured_Projects/portfolio-3d.jpg",
                          "readme": ""
                },
                {
                          "id": "quiz-app-fallback",
                          "name": "Quiz-App",
                          "full_name": "Nour-ibrahem30/Quiz-App",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Quiz-App",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-06-09T14:26:25Z",
                          "updated_at": "2025-06-10T15:42:33Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "sbs-website-clone-fallback",
                          "name": "SBS-Website-Clone",
                          "full_name": "Nour-ibrahem30/SBS-Website-Clone",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/SBS-Website-Clone",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2025-10-23T22:24:50Z",
                          "updated_at": "2026-02-09T10:15:18Z",
                          "default_branch": "main",
                          "projectImage": "/Featured_Projects/sbs-website.jpg",
                          "readme": ""
                },
                {
                          "id": "sbs_game-fallback",
                          "name": "SBS_Game",
                          "full_name": "Nour-ibrahem30/SBS_Game",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/SBS_Game",
                          "homepage": "https://sbs-game-three.vercel.app",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "JavaScript",
                          "created_at": "2026-03-05T18:52:37Z",
                          "updated_at": "2026-03-05T18:56:29Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "sun-system-fallback",
                          "name": "Sun-System",
                          "full_name": "Nour-ibrahem30/Sun-System",
                          "description": "Html, css",
                          "html_url": "https://github.com/Nour-ibrahem30/Sun-System",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2025-04-18T23:37:59Z",
                          "updated_at": "2025-05-18T14:01:59Z",
                          "default_branch": "main",
                          "readme": "Html, css"
                },
                {
                          "id": "toy-studio-fallback",
                          "name": "Toy-Studio",
                          "full_name": "Nour-ibrahem30/Toy-Studio",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Toy-Studio",
                          "homepage": "https://toy-studio.vercel.app",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2026-02-11T14:52:50Z",
                          "updated_at": "2026-02-11T16:25:16Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "travel-fallback",
                          "name": "Travel",
                          "full_name": "Nour-ibrahem30/Travel",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/Travel",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2025-08-24T11:55:32Z",
                          "updated_at": "2026-02-09T10:18:25Z",
                          "default_branch": "main",
                          "readme": ""
                },
                {
                          "id": "vivadecor-fallback",
                          "name": "VivaDecor",
                          "full_name": "Nour-ibrahem30/VivaDecor",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/VivaDecor",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "HTML",
                          "created_at": "2025-08-02T07:53:08Z",
                          "updated_at": "2025-08-02T15:29:14Z",
                          "default_branch": "main",
                          "projectImage": "/Featured_Projects/viva-decor.jpg",
                          "readme": ""
                },
                {
                          "id": "web-master-fallback",
                          "name": "web-master",
                          "full_name": "Nour-ibrahem30/web-master",
                          "description": "Html , css template-one",
                          "html_url": "https://github.com/Nour-ibrahem30/web-master",
                          "homepage": "",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "CSS",
                          "created_at": "2024-11-22T18:48:44Z",
                          "updated_at": "2025-01-10T03:15:18Z",
                          "default_branch": "main",
                          "readme": "Html , css template-one"
                },
                {
                          "id": "yly_reg-fallback",
                          "name": "YLY_Reg",
                          "full_name": "Nour-ibrahem30/YLY_Reg",
                          "description": "",
                          "html_url": "https://github.com/Nour-ibrahem30/YLY_Reg",
                          "homepage": "https://yly-reg.vercel.app",
                          "stargazers_count": 0,
                          "forks_count": 0,
                          "language": "JavaScript",
                          "created_at": "2026-02-26T23:01:28Z",
                          "updated_at": "2026-03-17T18:37:16Z",
                          "default_branch": "main",
                          "projectImage": "/Featured_Projects/yly.jpg",
                          "readme": ""
                }
      ];
        
        const fallbackProjects = [...localProjects, ...staticFallbackProjects];
        const projectsWithOverrides = fallbackProjects.map(applyProjectOverrides);
        const organized = organizeProjects(projectsWithOverrides);
        
        setAllProjects(organized);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (isInView && titleRef.current) {
      const timeoutId = setTimeout(() => {
        gsap.from(titleRef.current.children, {
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            once: true
          },
          y: 80,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          force3D: true,
          clearProps: 'all'
        });
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isInView]);

  const currentProjects = allProjects[activeTab] || [];
  const filteredProjects = techFilter === 'All'
    ? currentProjects
    : currentProjects.filter(p => {
        const tags = p.tags || [];
        const lang = p.language || '';
        if (techFilter === 'React') return tags.some(t => t.toLowerCase().includes('react')) || lang.toLowerCase() === 'javascriptreact';
        if (techFilter === 'JavaScript') return tags.some(t => t.toLowerCase() === 'javascript') || lang.toLowerCase() === 'javascript';
        if (techFilter === 'HTML/CSS') return tags.some(t => t.toLowerCase().includes('html') || t.toLowerCase().includes('css')) || lang.toLowerCase() === 'html' || lang.toLowerCase() === 'css';
        if (techFilter === 'TypeScript') return tags.some(t => t.toLowerCase().includes('typescript')) || lang.toLowerCase() === 'typescript';
        if (techFilter === 'WordPress') return tags.some(t => t.toLowerCase().includes('wordpress'));
        return true;
      });
  const visibleProjects = filteredProjects.slice(0, displayCount);

  const tabs = [
    { id: 'featured', label: 'Featured', icon: '⭐', count: allProjects.featured.length },
    { id: 'other', label: 'Other', icon: '📦', count: allProjects.other.length },
    ...(projectsConfig.display.showArchived ? [
      { id: 'archived', label: 'Archived', icon: '📚', count: allProjects.archived.length }
    ] : []),
  ];

  return (
    <section id="projects" ref={sectionRef} className="relative min-h-screen py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-black via-zinc-950 to-black w-full">
      {/* Background blobs — hidden on mobile */}
      <div className="hidden md:block absolute inset-0 opacity-20 -z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-96 h-96 bg-slate-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto z-10">
        {/* Title */}
        <div ref={titleRef} className="mb-12 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-4">
              <div>SELECTED</div>
              <div className="bg-gradient-to-r from-slate-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                PROJECTS
              </div>
            </h2>
            <p className="text-gray-500 text-lg uppercase tracking-wider">
              Organized by category and timeline
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: '200px' } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-slate-600 via-blue-500 to-cyan-500 rounded-full mt-4"
            />
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <ul className="flex flex-wrap items-center justify-center gap-4">
            {tabs.map((tab) => (
              <motion.li
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setDisplayCount(projectsConfig.display.projectsPerPage);
                    setTechFilter('All');
                  }}
                  className={`relative px-6 py-3 rounded-xl font-semibold uppercase tracking-wider text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white shadow-lg'
                      : 'bg-zinc-900/50 text-gray-400 hover:text-white hover:bg-zinc-800 border border-zinc-700'
                  }`}
                  style={activeTab === tab.id ? {
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    boxShadow: '0 10px 25px rgba(38, 208, 206, 0.5)'
                  } : {}}
                >
                  <span className="flex items-center gap-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-white/20'
                        : 'bg-zinc-800'
                    }`}>
                      {tab.count}
                    </span>
                  </span>
                  
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Tech Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {['All', 'React', 'JavaScript', 'HTML/CSS', 'TypeScript', 'WordPress'].map((tech) => (
            <button
              key={tech}
              onClick={() => setTechFilter(tech)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                techFilter === tech
                  ? 'bg-zinc-700 text-white border border-zinc-500'
                  : 'bg-zinc-900/50 text-gray-500 border border-zinc-800 hover:text-gray-300 hover:border-zinc-700'
              }`}
            >
              {tech}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <motion.div 
              className="relative w-24 h-24"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 border-4 border-slate-600/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-slate-600 rounded-full"></div>
            </motion.div>
          </div>
        ) : currentProjects.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-96 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md"
            >
              <div className="text-6xl mb-6">📭</div>
              <h3 className="text-2xl font-bold text-white mb-4">No Projects in {activeTab}</h3>
              <p className="text-gray-400">
                Try switching to another category to see more projects.
              </p>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Projects count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-gray-400 text-lg">
                Showing <span className="text-cyan-400 font-bold">{Math.min(displayCount, filteredProjects.length)}</span> of <span className="text-cyan-400 font-bold">{filteredProjects.length}</span> projects
              </p>
            </motion.div>

            {/* Projects Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr"
              >
                {visibleProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    isInView={isInView}
                    hoveredIndex={hoveredIndex}
                    setHoveredIndex={setHoveredIndex}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Load More Button */}
            {displayCount < filteredProjects.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col items-center gap-4 mt-16"
              >
                {/* Remaining count */}
                <p className="text-gray-500 text-sm">
                  <span className="text-cyan-400 font-bold">{filteredProjects.length - displayCount}</span> more projects remaining
                </p>

                <motion.button
                  onClick={() => setDisplayCount(prev => Math.min(prev + 6, filteredProjects.length))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-10 py-4 overflow-hidden rounded-full"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)' }} />
                  <div className="relative z-10 flex items-center gap-3 text-white font-semibold uppercase tracking-wider text-sm">
                    <span>Show More</span>
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </motion.svg>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// Project Card Component
function ProjectCard({ project, index, isInView, hoveredIndex, setHoveredIndex }) {
  const isNew = isNewProject(project);
  const isHighlighted = project.isHighlighted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      whileHover={{ y: -10 }}
      className="project-card group relative overflow-hidden bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800 hover:border-slate-600/50 transition-all duration-300 shadow-xl min-h-[420px] sm:h-[500px] flex flex-col"
    >
      {/* NEW or FEATURED Badge */}
      {(isNew || isHighlighted) && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-4 left-4 z-20"
        >
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isHighlighted 
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
          } shadow-lg`}>
            {isHighlighted ? '⭐ Featured' : '🆕 New'}
          </div>
        </motion.div>
      )}

      {/* Project Image */}
      <div className="relative h-64 overflow-hidden bg-zinc-800 flex-shrink-0">
        <div className="absolute inset-0">
          <img 
            src={project.projectImage}
            alt={project.displayName || project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://opengraph.githubassets.com/1/${project.full_name}`;
            }}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <motion.div 
          className="absolute top-6 left-6 text-8xl font-bold text-white/10"
          animate={{ 
            scale: hoveredIndex === index ? 1.2 : 1,
            y: hoveredIndex === index ? -10 : 0
          }}
          transition={{ duration: 0.4 }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>

        <motion.div
          className="absolute top-4 right-4"
          animate={{ 
            y: hoveredIndex === index ? [0, -10, 0] : 0,
            rotate: hoveredIndex === index ? [0, 5, -5, 0] : 0
          }}
          transition={{ duration: 2, repeat: hoveredIndex === index ? Infinity : 0 }}
        >
          {project.language && (
            <span className="inline-block text-xs px-3 py-1 bg-black/50 backdrop-blur-sm text-cyan-400 rounded-full uppercase tracking-wider border border-slate-600/30">
              {project.language}
            </span>
          )}
        </motion.div>
      </div>

      {/* Content - Flex column with proper spacing */}
      <div className="p-6 flex flex-col flex-1 overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <motion.h3 
              className="text-xl font-bold text-white mb-2 transition-all"
              style={{
                ...(hoveredIndex === index && {
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                })
              }}
              animate={{ x: hoveredIndex === index ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {project.displayName || project.name}
            </motion.h3>
          </div>
          
          <motion.div
            animate={{ 
              rotate: hoveredIndex === index ? 45 : 0,
              scale: hoveredIndex === index ? 1.3 : 1
            }}
            transition={{ duration: 0.3 }}
            className="ml-4"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.div>
        </div>

        <p className="text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed flex-grow overflow-hidden">
          {project.readme}
        </p>

        {/* Stats and Button Container - Fixed at bottom */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <motion.span 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.15, color: '#475569' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {project.stargazers_count}
            </motion.span>
            <motion.span 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.15 }}
              style={{ color: hoveredIndex === index ? '#3b82f6' : undefined }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              {project.forks_count}
            </motion.span>
          </div>

          {/* View Project Button - Consistent styling */}
          <motion.div
            className="relative overflow-hidden rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative px-6 py-3 border-2 text-center font-semibold text-sm transition-all duration-300 rounded-xl" style={{
              background: hoveredIndex === index ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)' : 'rgba(24, 24, 27, 0.5)',
              borderColor: hoveredIndex === index ? 'rgba(59, 130, 246, 0.5)' : 'rgba(63, 63, 70, 0.3)',
              color: hoveredIndex === index ? '#60a5fa' : '#9ca3af',
              backdropFilter: 'blur(8px)'
            }}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                View Project
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-slate-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          scale: hoveredIndex === index ? [1, 1.2, 1] : 1
        }}
        transition={{
          duration: 2,
          repeat: hoveredIndex === index ? Infinity : 0
        }}
      />

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl blur-xl" style={{ background: 'linear-gradient(135deg, rgba(26, 41, 128, 0.2) 0%, rgba(38, 208, 206, 0.2) 100%)' }}></div>
      </div>

      <a
        href={project.liveUrl || project.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0"
        aria-label={`View ${project.displayName || project.name}`}
      />
    </motion.div>
  );
}










