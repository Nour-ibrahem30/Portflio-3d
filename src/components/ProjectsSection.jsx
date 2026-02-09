import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [displayCount, setDisplayCount] = useState(6); // Show 6 initially
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Fallback projects in case GitHub API fails
  const fallbackProjects = [
    {
      id: 1,
      name: 'Portfolio Website',
      description: 'Personal portfolio website built with React, Vite, and Tailwind CSS',
      html_url: 'https://github.com/Nour-ibrahem30',
      language: 'JavaScript',
      stargazers_count: 0,
      forks_count: 0,
      projectImage: 'https://opengraph.githubassets.com/1/Nour-ibrahem30/Portflio-3d',
      readme: 'Personal portfolio website showcasing my projects and skills as a Front-End Developer.'
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('🔄 Fetching projects from GitHub...');
        // Fetch all repos (GitHub API returns max 100 per page)
        const headers = {
          'Accept': 'application/vnd.github.v3+json'
        };
        
        // Add GitHub token if available (for higher rate limits)
        const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
        if (githubToken) {
          headers['Authorization'] = `token ${githubToken}`;
          console.log('✅ Using GitHub Token');
        } else {
          console.warn('⚠️ No GitHub Token found. Rate limit: 60 requests/hour');
        }
        
        const reposResponse = await fetch('https://api.github.com/users/Nour-ibrahem30/repos?sort=updated&per_page=100', {
          headers
        });
        
        if (!reposResponse.ok) {
          const errorText = await reposResponse.text();
          console.error('❌ GitHub API Error:', reposResponse.status, errorText);
          throw new Error(`GitHub API error: ${reposResponse.status}`);
        }
        
        const repos = await reposResponse.json();
        console.log(`✅ Fetched ${repos.length} repositories`);
        
        // Filter out forked repos if you want only your own projects
        const ownRepos = repos.filter(repo => !repo.fork);
        console.log(`✅ Filtered to ${ownRepos.length} own repositories`);
        
        // Fetch README and images for each repo
        const projectsWithReadme = await Promise.all(
          ownRepos.map(async (repo) => {
            let description = repo.description || 'No description available';
            let projectImage = null;
            
            // Priority 1: Check if project has GitHub Pages with live site
            if (repo.has_pages || (repo.homepage && repo.homepage.includes('github.io'))) {
              // For GitHub Pages, we'll still check README for images first
              // as they usually have better screenshots than auto-generated ones
            }
            
            try {
              // Try to fetch README first (for both description and images)
              const readmeResponse = await fetch(`https://api.github.com/repos/Nour-ibrahem30/${repo.name}/readme`, {
                headers
              });
              
              if (readmeResponse.ok) {
                const readmeData = await readmeResponse.json();
                
                // Decode base64 with UTF-8 support for Arabic
                const binaryString = atob(readmeData.content);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                const readmeContent = new TextDecoder('utf-8').decode(bytes);
                
                // Extract meaningful content from README
                const lines = readmeContent.split('\n');
                let meaningfulText = '';
                
                for (const line of lines) {
                  const trimmed = line.trim();
                  // Skip headers, images, badges, empty lines, code blocks
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
                
                // Try to find images in README
                const imageRegex = /!\[.*?\]\((.*?)\)/g;
                const images = [...readmeContent.matchAll(imageRegex)];
                if (images.length > 0) {
                  let imgUrl = images[0][1];
                  // Convert relative URLs to absolute
                  if (!imgUrl.startsWith('http')) {
                    imgUrl = `https://raw.githubusercontent.com/Nour-ibrahem30/${repo.name}/${repo.default_branch}/${imgUrl}`;
                  }
                  projectImage = imgUrl;
                }
                
                // Also check for HTML img tags in README
                if (!projectImage) {
                  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/g;
                  const htmlImages = [...readmeContent.matchAll(htmlImageRegex)];
                  if (htmlImages.length > 0) {
                    let imgUrl = htmlImages[0][1];
                    if (!imgUrl.startsWith('http')) {
                      imgUrl = `https://raw.githubusercontent.com/Nour-ibrahem30/${repo.name}/${repo.default_branch}/${imgUrl}`;
                    }
                    projectImage = imgUrl;
                  }
                }
              }
              
              // If no image found in README, try to find screenshot in repo
              if (!projectImage) {
                try {
                  const contentsResponse = await fetch(`https://api.github.com/repos/Nour-ibrahem30/${repo.name}/contents`, {
                    headers
                  });
                  if (contentsResponse.ok) {
                    const contents = await contentsResponse.json();
                    
                    // Look for common screenshot filenames in root
                    const screenshotFile = contents.find(file => 
                      /screenshot|preview|demo|thumbnail|cover|banner/i.test(file.name) && 
                      /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name)
                    );
                    
                    if (screenshotFile) {
                      projectImage = screenshotFile.download_url;
                    } else {
                      // Check in common folders
                      const imagesFolders = contents.filter(item => 
                        item.type === 'dir' && 
                        /images?|assets?|screenshots?|public|static/i.test(item.name)
                      );
                      
                      for (const folder of imagesFolders) {
                        try {
                          const folderResponse = await fetch(folder.url, { headers });
                          if (folderResponse.ok) {
                            const folderContents = await folderResponse.json();
                            const imageFile = folderContents.find(file => 
                              /screenshot|preview|demo|thumbnail|cover|banner|hero/i.test(file.name) && 
                              /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name)
                            );
                            if (imageFile) {
                              projectImage = imageFile.download_url;
                              break;
                            }
                          }
                        } catch (err) {
                          console.log(`Could not check folder ${folder.name}`);
                        }
                      }
                    }
                  }
                } catch (err) {
                  console.log(`No screenshot found in ${repo.name}`);
                }
              }
              
              // If still no image, use OpenGraph as fallback (not production URL)
              if (!projectImage) {
                projectImage = `https://opengraph.githubassets.com/1/${repo.full_name}`;
              }
              
            } catch (error) {
              console.log(`Could not fetch data for ${repo.name}:`, error);
            }
            
            return {
              ...repo,
              readme: description,
              projectImage: projectImage
            };
          })
        );
        
        setProjects(projectsWithReadme);
        console.log(`✅ Successfully loaded ${projectsWithReadme.length} projects`);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching projects:', err);
        console.log('⚠️ Using fallback projects');
        // Set fallback projects if API fails
        setProjects(fallbackProjects);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (isInView && titleRef.current) {
      gsap.from(titleRef.current.children, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power4.out'
      });
    }
  }, [isInView]);

  return (
    <section id="projects" ref={sectionRef} className="relative min-h-screen py-32 px-6 md:px-12 bg-gradient-to-b from-black via-zinc-950 to-black w-full">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        <div ref={titleRef} className="mb-20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-4">
              <div>SELECTED</div>
              <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                PROJECTS
              </div>
            </h2>
            <p className="text-gray-500 text-lg uppercase tracking-wider">
              Latest work from GitHub
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: '200px' } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mt-4"
            />
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <motion.div 
              className="relative w-24 h-24"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full"></div>
            </motion.div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-96 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md"
            >
              <div className="text-6xl mb-6">😕</div>
              <h3 className="text-2xl font-bold text-white mb-4">No Projects Found</h3>
              <p className="text-gray-400 mb-6">
                Unable to fetch projects from GitHub. This might be due to API rate limits.
              </p>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-yellow-400 text-sm">
                  💡 <strong>Tip:</strong> Add a GitHub Token in <code className="bg-black/30 px-2 py-1 rounded">.env</code> file to increase rate limits from 60 to 5000 requests/hour.
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Projects count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-gray-400 text-lg">
                Showing <span className="text-purple-400 font-bold">{Math.min(displayCount, projects.length)}</span> of <span className="text-purple-400 font-bold">{projects.length}</span> projects
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, displayCount).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -10 }}
                className="project-card group relative overflow-hidden bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 shadow-xl"
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden bg-zinc-800">
                  <div className="absolute inset-0">
                    <img 
                      src={project.projectImage}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to OpenGraph if image fails
                        e.target.src = `https://opengraph.githubassets.com/1/${project.full_name}`;
                      }}
                    />
                  </div>
                  
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Project number */}
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

                  {/* Hover overlay with gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Floating badge */}
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{ 
                      y: hoveredIndex === index ? [0, -10, 0] : 0,
                      rotate: hoveredIndex === index ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: hoveredIndex === index ? Infinity : 0 }}
                  >
                    {project.language && (
                      <span className="inline-block text-xs px-3 py-1 bg-black/50 backdrop-blur-sm text-purple-400 rounded-full uppercase tracking-wider border border-purple-500/30">
                        {project.language}
                      </span>
                    )}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <motion.h3 
                        className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-400 group-hover:to-pink-400 transition-all"
                        animate={{ x: hoveredIndex === index ? 5 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {project.name}
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
                      <svg className="w-6 h-6 text-gray-600 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </div>

                  <p className="text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {project.readme}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                    <motion.span 
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.15, color: '#a855f7' }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      {project.stargazers_count}
                    </motion.span>
                    <motion.span 
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.15, color: '#a855f7' }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {project.forks_count}
                    </motion.span>
                  </div>

                  {/* View button */}
                  <motion.div
                    className="relative overflow-hidden rounded-lg"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-center font-medium text-sm group-hover:bg-purple-500/20 transition-colors">
                      View Project
                    </div>
                  </motion.div>
                </div>

                {/* Decorative corner with animation */}
                <motion.div 
                  className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: hoveredIndex === index ? [1, 1.2, 1] : 1
                  }}
                  transition={{
                    duration: 2,
                    repeat: hoveredIndex === index ? Infinity : 0
                  }}
                />

                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"></div>
                </div>

                {/* Link */}
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                  aria-label={`View ${project.name} on GitHub`}
                />
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {displayCount < projects.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center mt-16"
            >
              <motion.button
                onClick={() => setDisplayCount(prev => Math.min(prev + 6, projects.length))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-5 overflow-hidden rounded-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex items-center gap-3 text-white font-semibold uppercase tracking-wider">
                  <span>Load More Projects</span>
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </motion.svg>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Show All Button (when some are hidden) */}
          {displayCount < projects.length && displayCount + 6 < projects.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex justify-center mt-6"
            >
              <button
                onClick={() => setDisplayCount(projects.length)}
                className="text-gray-500 hover:text-purple-400 transition-colors text-sm uppercase tracking-wider"
              >
                or Show All ({projects.length} projects)
              </button>
            </motion.div>
          )}
          </>
        )}
      </div>
    </section>
  );
}
