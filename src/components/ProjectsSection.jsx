import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  useEffect(() => {
    fetch('https://api.github.com/users/Nour-ibrahem30/repos?sort=updated&per_page=6')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
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
    <section id="projects" ref={sectionRef} className="relative min-h-screen py-32 px-6 md:px-12 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden">
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
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
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
                {/* Image placeholder with gradient */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-600/40 to-blue-600/40"
                    animate={{ 
                      scale: hoveredIndex === index ? 1.3 : 1,
                      rotate: hoveredIndex === index ? 10 : 0
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                  
                  {/* Animated particles on hover */}
                  {hoveredIndex === index && (
                    <div className="absolute inset-0">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                            y: [0, -50]
                          }}
                          transition={{
                            duration: 1,
                            delay: i * 0.1,
                            repeat: Infinity
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Project number */}
                  <motion.div 
                    className="absolute top-6 left-6 text-8xl font-bold text-white/5"
                    animate={{ 
                      scale: hoveredIndex === index ? 1.3 : 1,
                      x: hoveredIndex === index ? 15 : 0,
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

                  <p className="text-gray-400 mb-4 line-clamp-2 text-sm">
                    {project.description || 'A creative project showcasing modern web development'}
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
        )}
      </div>
    </section>
  );
}
