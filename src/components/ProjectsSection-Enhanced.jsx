import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { organizeProjects, applyProjectOverrides, isNewProject } from '../utils/projectUtils';
import { projectsConfig, getProjectOverride } from '../config/projectsConfig';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSectionEnhanced() {
  const [allProjects, setAllProjects] = useState({ featured: [], other: [], archived: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(projectsConfig.display.defaultTab);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [displayCount, setDisplayCount] = useState(projectsConfig.display.projectsPerPage);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('🔄 Starting to fetch projects...');
        
        const headers = { 'Accept': 'application/vnd.github.v3+json' };
        
        const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
        if (githubToken) {
          headers['Authorization'] = `token ${githubToken}`;
          console.log('✅ GitHub token found');
        } else {
          console.log('⚠️ No GitHub token found - using public API (rate limited)');
        }
        
        console.log('📡 Fetching repositories from GitHub...');
        const reposResponse = await fetch(
          'https://api.github.com/users/Nour-ibrahem30/repos?per_page=100',
          { headers }
        );
        
        console.log('📊 GitHub API Response Status:', reposResponse.status);
        
        if (!reposResponse.ok) {
          const errorText = await reposResponse.text();
          console.error('❌ GitHub API Error:', reposResponse.status, errorText);
          throw new Error(`GitHub API error: ${reposResponse.status} - ${errorText}`);
        }
        
        const repos = await reposResponse.json();
        console.log('📦 Total repositories fetched:', repos.length);
        
        const ownRepos = repos.filter(repo => !repo.fork);
        console.log('🏠 Own repositories (non-forks):', ownRepos.length);
        
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
        
        console.log('🏠 Local projects added:', localProjects.length);
        
        const allRepos = [...localProjects, ...ownRepos];
        
        // Fetch README and images for each repo
        const projectsWithData = await Promise.all(
          allRepos.map(async (repo) => {
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
          })
        );
        
        // Apply overrides and organize
        const projectsWithOverrides = projectsWithData.map(applyProjectOverrides);
        const organized = organizeProjects(projectsWithOverrides);
        
        console.log('📋 Organized projects:', {
          featured: organized.featured.length,
          other: organized.other.length,
          archived: organized.archived.length
        });
        
        setAllProjects(organized);
        setLoading(false);
        console.log('✅ Projects loaded successfully!');
      } catch (err) {
        console.error('❌ Error fetching projects:', err);
        console.error('📝 Error details:', err.message);
        
        // Fallback: show only local projects if GitHub fails
        console.log('🔄 Falling back to local projects only...');
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
            id: 'portfolio-3d-fallback',
            name: 'Portflio-3d',
            full_name: 'Nour-ibrahem30/Portflio-3d',
            description: 'Modern 3D portfolio website with interactive animations, built with React and Vite',
            html_url: 'https://github.com/Nour-ibrahem30/Portflio-3d',
            homepage: 'https://nour-ibrahem30.github.io/Portflio-3d/',
            stargazers_count: 5,
            forks_count: 2,
            language: 'JavaScript',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString(),
            default_branch: 'main',
            projectImage: '/Featured_Projects/portfolio-3d.jpg',
            readme: 'Modern 3D portfolio website with interactive animations, built with React, Vite, and Tailwind CSS. Features dynamic GitHub API integration and smooth GSAP animations.'
          },
          {
            id: 'elgokh-fallback',
            name: 'Elgokh',
            full_name: 'Nour-ibrahem30/Elgokh',
            description: 'Professional website project showcasing modern web development techniques',
            html_url: 'https://github.com/Nour-ibrahem30/Elgokh',
            homepage: '',
            stargazers_count: 3,
            forks_count: 1,
            language: 'HTML',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString(),
            default_branch: 'main',
            projectImage: '/Featured_Projects/elgokh.jpg',
            readme: 'Professional website project showcasing modern web development techniques and responsive design.'
          },
          {
            id: 'creative-child-fallback',
            name: 'Creative-child',
            full_name: 'Nour-ibrahem30/Creative-child',
            description: 'Creative and colorful website designed for children',
            html_url: 'https://github.com/Nour-ibrahem30/Creative-child',
            homepage: '',
            stargazers_count: 2,
            forks_count: 0,
            language: 'CSS',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString(),
            default_branch: 'main',
            projectImage: '/Featured_Projects/creative-child.jpg',
            readme: 'Creative and colorful website designed for children, featuring interactive elements and engaging UI.'
          },
          {
            id: 'value-marketing-fallback',
            name: 'intiative_Website_Value',
            full_name: 'Nour-ibrahem30/intiative_Website_Value',
            description: 'Custom React website built for Value Marketing company',
            html_url: 'https://github.com/Nour-ibrahem30/intiative_Website_Value',
            homepage: '',
            stargazers_count: 1,
            forks_count: 0,
            language: 'React',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString(),
            default_branch: 'main',
            projectImage: '/Featured_Projects/value-marketing.jpg',
            readme: 'Custom React website built for Value Marketing company. Features modern design, responsive layout, and smooth animations.'
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
  const visibleProjects = currentProjects.slice(0, displayCount);

  const tabs = [
    { id: 'featured', label: 'Featured', icon: '⭐', count: allProjects.featured.length },
    { id: 'other', label: 'Other', icon: '📦', count: allProjects.other.length },
    ...(projectsConfig.display.showArchived ? [
      { id: 'archived', label: 'Archived', icon: '📚', count: allProjects.archived.length }
    ] : []),
  ];

  return (
    <section id="projects" ref={sectionRef} className="relative min-h-screen py-32 px-6 md:px-12 bg-gradient-to-b from-black via-zinc-950 to-black w-full">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 -z-10">
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
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-4">
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
                Showing <span className="text-cyan-400 font-bold">{Math.min(displayCount, currentProjects.length)}</span> of <span className="text-cyan-400 font-bold">{currentProjects.length}</span> projects
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
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
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
            {displayCount < currentProjects.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col items-center gap-4 mt-16"
              >
                {/* Remaining count */}
                <p className="text-gray-500 text-sm">
                  <span className="text-cyan-400 font-bold">{currentProjects.length - displayCount}</span> more projects remaining
                </p>

                <motion.button
                  onClick={() => setDisplayCount(prev => Math.min(prev + 6, currentProjects.length))}
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
      className="project-card group relative overflow-hidden bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800 hover:border-slate-600/50 transition-all duration-300 shadow-xl h-[500px] flex flex-col"
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










