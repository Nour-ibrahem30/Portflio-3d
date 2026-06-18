import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';
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

  const y  = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const achievements = [
    {
      icon: '🏆',
      title: 'GDG Banha 2026',
      subtitle: 'Technical Contributor',
      desc: 'Guided 50+ participants through HTML & CSS front-end track',
      color: 'from-purple-500 to-pink-500',
      border: 'hover:border-purple-500/50',
      glow: 'group-hover:shadow-purple-500/20',
      year: '2026',
    },
    {
      icon: '🎓',
      title: 'Web Master Internship',
      subtitle: 'Front-End Development',
      desc: 'Built 4 complete projects during 3-month internship',
      color: 'from-green-500 to-emerald-500',
      border: 'hover:border-green-500/50',
      glow: 'group-hover:shadow-green-500/20',
      year: '2025',
    },
    {
      icon: '💼',
      title: 'Value Marketing',
      subtitle: 'Front-End Developer',
      desc: '3 WordPress sites + 1 React app in 5+ months',
      color: 'from-blue-500 to-cyan-500',
      border: 'hover:border-blue-500/50',
      glow: 'group-hover:shadow-blue-500/20',
      year: '2025',
    },
    {
      icon: '🤝',
      title: 'YLY Initiative',
      subtitle: 'Core Team Member',
      desc: 'Built QR-based volunteer registration system',
      color: 'from-orange-500 to-yellow-500',
      border: 'hover:border-orange-500/50',
      glow: 'group-hover:shadow-orange-500/20',
      year: '2025',
    },
    {
      icon: '⭐',
      title: 'Shabab Betesaed',
      subtitle: 'Volunteer Developer',
      desc: 'Full React + TypeScript website for NGO',
      color: 'from-red-500 to-orange-500',
      border: 'hover:border-red-500/50',
      glow: 'group-hover:shadow-red-500/20',
      year: '2025',
    },
  ];

  useEffect(() => {
    if (isInView && titleRef.current) {
      // Defer animation
      const timeoutId = setTimeout(() => {
        gsap.from(titleRef.current.children, {
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            once: true // Only animate once
          },
          x: -60, // Reduced from -80
          opacity: 0,
          stagger: 0.06, // Reduced from 0.08
          duration: 0.6, // Reduced from 0.8
          ease: 'power2.out', // Changed from power3
          force3D: true, // GPU acceleration
          clearProps: 'all' // Clean up after animation
        });
      }, 50);
      
      return () => clearTimeout(timeoutId);
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
      gradient: 'from-slate-600 via-cyan-700 to-blue-700',
      skills: ['React', 'TypeScript', 'Redux', 'Hooks', 'Context API'],
      color: 'slate'
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
    <section id="about" ref={sectionRef} className="relative min-h-screen py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-black w-full">
      {/* Background blobs — hidden on mobile */}
      <div className="hidden md:block absolute inset-0 opacity-20 pointer-events-none">
        <motion.div style={{ y }} className="absolute top-20 right-20 w-96 h-96 bg-slate-600/30 rounded-full blur-3xl" />
        <motion.div style={{ y: y2 }} className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-700/30 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(71, 85, 105, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(71, 85, 105, 0.5) 1px, transparent 1px)
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
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-4">
              <div>ABOUT</div>
              <div className="bg-gradient-to-r from-slate-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ME
              </div>
            </h2>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: '200px' } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-slate-600 to-cyan-700 rounded-full"
            />
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 mb-20 md:mb-32">
          {/* Left: Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <motion.div
              whileHover={{ x: 10 }}
              className="relative pl-6 border-l-4 border-slate-600"
            >
              <p className="text-xl sm:text-3xl md:text-4xl text-gray-300 leading-relaxed font-light">
                Front-End Developer passionate about building{' '}
                <span className="text-transparent bg-gradient-to-r from-slate-400 to-cyan-600 bg-clip-text font-semibold">
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
              className="relative p-6 bg-gradient-to-r from-slate-600/10 to-cyan-700/10 border border-slate-600/30 rounded-2xl backdrop-blur-sm overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-cyan-700/20"
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
                <svg className="w-8 h-8 text-cyan-400 mb-3" fill="currentColor" viewBox="0 0 24 24">
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
              { label: 'PROJECTS', value: '20+ Websites', icon: '🚀', color: 'from-slate-600 to-cyan-700' },
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
                <div className="relative p-8 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 hover:border-slate-600/50 transition-all overflow-hidden">
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
                      <div className="text-4xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-slate-400 group-hover:to-cyan-600 transition-all">
                        {stat.value}
                      </div>
                    </div>

                    {/* Arrow */}
                    <motion.svg
                      className="w-6 h-6 text-gray-600 group-hover:text-cyan-400"
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
                  className="relative h-full p-8 bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 hover:border-slate-600/50 transition-all overflow-hidden transform-gpu perspective-1000"
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
                    className="absolute top-6 right-6 w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center border border-zinc-700 group-hover:border-slate-600/50 transition-all"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-2xl font-bold text-gray-600 group-hover:text-cyan-400 transition-colors">
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
                    <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-slate-400 group-hover:to-cyan-600 transition-all">
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
                          className="px-3 py-1 bg-zinc-800/50 text-gray-400 rounded-full text-xs font-medium border border-zinc-700 hover:border-slate-600/50 hover:text-cyan-400 transition-all cursor-default"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-slate-600/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    animate={hoveredCard === index ? {
                      x: ['-100%', '100%'],
                    } : {}}
                    transition={{ duration: 1 }}
                  />

                  {/* Corner Accent */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-slate-600/20 rounded-tl-3xl group-hover:border-slate-600/50 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-slate-600/20 rounded-br-3xl group-hover:border-slate-600/50 transition-colors" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements / Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-32"
        >
          <div className="text-center mb-16">
            <motion.h3
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 1.3 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider"
            >
              Achievements
            </motion.h3>
            <p className="text-gray-500 text-lg">Experience & Recognition</p>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: '128px' } : { width: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="h-1 bg-gradient-to-r from-slate-600 to-cyan-700 rounded-full mt-4 mx-auto"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={`relative group bg-zinc-900/60 border border-zinc-800 ${item.border} rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl ${item.glow}`}
              >
                {/* top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* bg glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 rounded-2xl`} />

                <div className="relative z-10 flex gap-4">
                  {/* Icon circle */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-white font-bold text-sm leading-tight">{item.title}</div>
                      <span className={`text-xs font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent flex-shrink-0`}>
                        {item.year}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5 font-medium">{item.subtitle}</div>
                    <div className="text-gray-600 text-xs mt-2 leading-relaxed group-hover:text-gray-500 transition-colors">
                      {item.desc}
                    </div>
                  </div>
                </div>

                {/* corner decoration */}
                <div className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl`} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Certificates Section ── */}
        <CertificatesSection isInView={isInView} />

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Certificates Section Component
───────────────────────────────────────────── */
const CERTS = [
  {
    title: 'Web Development',
    issuer: 'Generous Academy',
    image: '/Generous/cert-1.webp',
    imageFallback: '/Generous/cert-1.jpg',
    color: 'from-blue-500 to-cyan-500',
    ringColor: '#06b6d4',
    year: '2024',
    icon: '🌐',
  },
  {
    title: 'Front-End Development',
    issuer: 'Generous Academy',
    image: '/Generous/cert-2.webp',
    imageFallback: '/Generous/cert-2.jpg',
    color: 'from-green-500 to-emerald-500',
    ringColor: '#10b981',
    year: '2024',
    icon: '⚛️',
  },
  {
    title: 'Professional Certificate',
    issuer: 'Generous Academy',
    image: '/Generous/cert-3.webp',
    imageFallback: '/Generous/cert-3.jpg',
    color: 'from-purple-500 to-violet-500',
    ringColor: '#8b5cf6',
    year: '2024',
    icon: '📜',
  },
  {
    title: 'Achievement Award',
    issuer: 'Generous Academy',
    image: '/Generous/cert-4.webp',
    imageFallback: '/Generous/cert-4.png',
    color: 'from-yellow-500 to-orange-500',
    ringColor: '#f59e0b',
    year: '2024',
    icon: '🏆',
  },
];

function CertificatesSection({ isInView }) {
  const [imgIdx, setImgIdx] = useState(null); // null = modal closed

  const openAt = (i) => setImgIdx(i);
  const close  = ()  => setImgIdx(null);
  const prev   = ()  => setImgIdx(i => (i - 1 + CERTS.length) % CERTS.length);
  const next   = ()  => setImgIdx(i => (i + 1) % CERTS.length);

  // keyboard nav
  useEffect(() => {
    if (imgIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [imgIdx]);

  // lock scroll — only depends on open/closed state, never re-runs while navigating
  const isModalOpen = imgIdx !== null;
  useEffect(() => {
    if (!isModalOpen) return;
    const y = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${y}px`;
    document.body.style.width    = '100%';
    return () => {
      const stored = Math.abs(parseInt(document.body.style.top || '0', 10));
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
      window.scrollTo(0, stored);
    };
  }, [isModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className="mt-24"
    >
      {/* Header */}
      <div className="text-center mb-14">
        <motion.h3
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ delay: 1.7 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider"
        >
          Certificates
        </motion.h3>
        <p className="text-gray-500 text-lg">Professional Development &amp; Training</p>
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: '128px' } : { width: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mt-4 mx-auto"
        />
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CERTS.map((cert, i) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.9 + i * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }}
            onClick={() => openAt(i)}
            className="group relative bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300"
          >
            {/* top color bar */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cert.color} opacity-0 group-hover:opacity-100 transition-opacity z-10`} />

            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-zinc-800">
              <picture>
                <source srcSet={cert.image} type="image/webp" />
                <img
                  src={cert.imageFallback}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="208"
                />
              </picture>
              {/* hover overlay */}
              <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
                <span className="text-white text-xs font-bold tracking-widest uppercase">View</span>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t ${cert.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            </div>

            {/* Info */}
            <div className="p-4 relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />
              <div className="relative flex items-start justify-between gap-2">
                <div>
                  <div className="text-white font-bold text-sm leading-tight">{cert.title}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{cert.issuer}</div>
                </div>
                <span className={`text-xs font-bold bg-gradient-to-r ${cert.color} bg-clip-text text-transparent flex-shrink-0`}>
                  {cert.year}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Modal via Portal ── */}
      <AnimatePresence>
        {imgIdx !== null && createPortal(
          <motion.div
            key="cert-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/93 backdrop-blur-2xl p-4 md:p-8"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit   ={{ opacity: 0, scale: 0.88, y: 30 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700/80 shadow-2xl"
            >
              {/* gradient top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${CERTS[imgIdx].color}`} />

              {/* Header row */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CERTS[imgIdx].color} flex items-center justify-center text-xl shadow-lg`}>
                    {CERTS[imgIdx].icon}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm leading-tight">{CERTS[imgIdx].title}</div>
                    <div className="text-gray-500 text-xs">{CERTS[imgIdx].issuer} · {CERTS[imgIdx].year}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm font-semibold tabular-nums">
                    {imgIdx + 1} / {CERTS.length}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={close}
                    className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-red-500/80 border border-zinc-700 flex items-center justify-center transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Main image */}
              <div className="relative mx-4 mb-4 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/50">
                <AnimatePresence mode="wait">
                  <motion.picture
                    key={imgIdx}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1    }}
                    exit  ={{ opacity: 0, scale: 0.97  }}
                    transition={{ duration: 0.28 }}
                    className="block w-full"
                  >
                    <source srcSet={CERTS[imgIdx].image} type="image/webp" />
                    <img
                      src={CERTS[imgIdx].imageFallback}
                      alt={CERTS[imgIdx].title}
                      className="w-full object-contain max-h-[55vh]"
                      loading="eager"
                      decoding="async"
                    />
                  </motion.picture>
                </AnimatePresence>

                {/* Prev / Next arrows */}
                <motion.button
                  whileHover={{ scale: 1.1, x: -2 }} whileTap={{ scale: 0.9 }}
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/65 hover:bg-black/90 border border-white/10 flex items-center justify-center backdrop-blur-sm"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, x: 2 }} whileTap={{ scale: 0.9 }}
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/65 hover:bg-black/90 border border-white/10 flex items-center justify-center backdrop-blur-sm"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>

              {/* Thumbnail strip */}
              <div className="flex justify-center gap-2.5 px-4 pb-5">
                {CERTS.map((c, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setImgIdx(i)}
                    style={i === imgIdx ? { boxShadow: `0 0 0 2px ${c.ringColor}` } : {}}
                    className={`relative rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      i === imgIdx ? 'w-16 h-12 opacity-100' : 'w-12 h-9 opacity-35 hover:opacity-65'
                    }`}
                    aria-label={c.title}
                  >
                    <picture>
                      <source srcSet={c.image} type="image/webp" />
                      <img src={c.imageFallback} alt={c.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </picture>
                  </motion.button>
                ))}
              </div>

              {/* keyboard hint */}
              <div className="hidden md:flex items-center justify-center gap-5 pb-4 text-zinc-600 text-xs">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px]">←</kbd>
                  <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px]">→</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px]">ESC</kbd>
                  Close
                </span>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </motion.div>
  );
}









