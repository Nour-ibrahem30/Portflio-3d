import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  useEffect(() => {
    if (isInView && titleRef.current) {
      gsap.from(titleRef.current.children, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
        x: -100,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power4.out'
      });
    }
  }, [isInView]);

  const services = [
    {
      number: '01',
      title: 'Responsive Web Development',
      desc: 'Building mobile-first, responsive websites using HTML5, CSS3, SCSS, and JavaScript (ES6+) with pixel-perfect precision and modern best practices',
      icon: '📱',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      skills: ['HTML5', 'CSS3', 'SCSS', 'JavaScript', 'Mobile-First'],
      color: 'blue'
    },
    {
      number: '02',
      title: 'React Development',
      desc: 'Creating interactive, component-based user interfaces with React and TypeScript for scalable, maintainable applications with state management',
      icon: '⚛️',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      skills: ['React', 'TypeScript', 'Redux', 'Hooks', 'Context API'],
      color: 'purple'
    },
    {
      number: '03',
      title: 'Web Accessibility & Performance',
      desc: 'Implementing WCAG 2.1 standards and optimizing web performance for better user experience, SEO, and accessibility compliance',
      icon: '♿',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      skills: ['WCAG 2.1', 'Performance', 'SEO', 'Lighthouse', 'Core Web Vitals'],
      color: 'green'
    },
  ];

  return (
    <section id="about" ref={sectionRef} className="relative min-h-screen py-32 px-6 md:px-12 bg-black w-full">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          style={{ y }}
          className="absolute top-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <div ref={titleRef} className="mb-20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-4">
              <div>ABOUT</div>
              <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                ME
              </div>
            </h2>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: '200px' } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 mb-32">
          {/* Left: Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <motion.div
              whileHover={{ x: 10 }}
              className="relative pl-6 border-l-4 border-purple-500"
            >
              <p className="text-3xl md:text-4xl text-gray-300 leading-relaxed font-light">
                Front-End Developer passionate about building{' '}
                <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold">
                  clean, responsive, and user-friendly
                </span>{' '}
                web interfaces.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-500 leading-relaxed"
            >
              Skilled in HTML5, CSS3, JavaScript (ES6+), SCSS, and React, with growing experience in TypeScript. 
              Strong focus on accessibility, performance optimization, and modern front-end best practices.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-500 leading-relaxed"
            >
              Currently pursuing a Bachelor's degree in Management Information Systems at HICMIS with a GPA of 3.0/4.0.
            </motion.p>

            {/* Animated Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8 }}
              className="relative p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl backdrop-blur-sm overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <div className="relative">
                <svg className="w-8 h-8 text-purple-400 mb-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="text-gray-300 italic text-lg">
                  "Code is like humor. When you have to explain it, it's bad."
                </p>
                <p className="text-gray-500 text-sm mt-2">— Cory House</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {[
              { label: 'EXPERIENCE', value: '2+ Years', icon: '💼', color: 'from-blue-500 to-cyan-500' },
              { label: 'PROJECTS', value: '20+ Websites', icon: '🚀', color: 'from-purple-500 to-pink-500' },
              { label: 'EDUCATION', value: 'GPA 3.0/4.0', icon: '🎓', color: 'from-green-500 to-emerald-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="relative group"
              >
                <div className="relative p-8 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 hover:border-purple-500/50 transition-all overflow-hidden">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative flex items-center gap-6">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className="text-5xl"
                    >
                      {stat.icon}
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 uppercase tracking-widest mb-2">
                        {stat.label}
                      </div>
                      <div className="text-4xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                        {stat.value}
                      </div>
                    </div>

                    {/* Arrow */}
                    <motion.svg
                      className="w-6 h-6 text-gray-600 group-hover:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </div>

                  {/* Decorative Corner */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* What I Do Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="mb-16 text-center">
            <motion.h3
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.9 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4 uppercase tracking-wider"
            >
              What I Do
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1 }}
              className="text-gray-500 text-lg"
            >
              Specialized services to bring your ideas to life
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative"
              >
                {/* 3D Card Effect */}
                <motion.div
                  whileHover={{ y: -20, rotateX: 5, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-full p-8 bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 hover:border-purple-500/50 transition-all overflow-hidden transform-gpu perspective-1000"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Gradient Overlay */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    animate={hoveredCard === index ? {
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Number Badge */}
                  <motion.div
                    className="absolute top-6 right-6 w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center border border-zinc-700 group-hover:border-purple-500/50 transition-all"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-2xl font-bold text-gray-600 group-hover:text-purple-400 transition-colors">
                      {service.number}
                    </span>
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    className="text-7xl mb-6 relative z-10"
                    animate={hoveredCard === index ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    {service.icon}
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                      {service.title}
                    </h4>
                    
                    <p className="text-gray-500 leading-relaxed mb-6 group-hover:text-gray-400 transition-colors">
                      {service.desc}
                    </p>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2">
                      {service.skills.map((skill, i) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                          transition={{ delay: 1.2 + index * 0.2 + i * 0.1 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="px-3 py-1 bg-zinc-800/50 text-gray-400 rounded-full text-xs font-medium border border-zinc-700 hover:border-purple-500/50 hover:text-purple-400 transition-all cursor-default"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    animate={hoveredCard === index ? {
                      x: ['-100%', '100%'],
                    } : {}}
                    transition={{ duration: 1 }}
                  />

                  {/* Corner Accent */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-500/20 rounded-tl-3xl group-hover:border-purple-500/50 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-500/20 rounded-br-3xl group-hover:border-purple-500/50 transition-colors" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
