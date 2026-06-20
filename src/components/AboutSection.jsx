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
      year: '2025',
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
      icon: '⚛',
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
      {/* Background blobs â€” hidden on mobile */}
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
                <p className="text-gray-500 text-sm mt-2">â€” Cory House</p>
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

        {/* â”€â”€ Certificates Section â”€â”€ */}
        <CertificatesSection isInView={isInView} />

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Certificates Section — Stack Slideshow
───────────────────────────────────────────── */
const CERTS = [
  {
    title: 'Web Development',
    issuer: 'Generous Academy',
    image: '/Generous/cert-1.jpg',
    color: 'from-blue-500 to-cyan-500',
    ringColor: '#06b6d4',
    year: '2025',
    icon: '🌐',
  },
  {
    title: 'Front-End Development',
    issuer: 'Generous Academy',
    image: '/Generous/cert-2.jpg',
    color: 'from-green-500 to-emerald-500',
    ringColor: '#10b981',
    year: '2025',
    icon: '⚡',
  },
  {
    title: 'Professional Certificate',
    issuer: 'Generous Academy',
    image: '/Generous/cert-3.jpg',
    color: 'from-purple-500 to-violet-500',
    ringColor: '#8b5cf6',
    year: '2025',
    icon: '📜',
  },
  {
    title: 'Achievement Award',
    issuer: 'Generous Academy',
    image: '/Generous/cert-4.png',
    color: 'from-yellow-500 to-orange-500',
    ringColor: '#f59e0b',
    year: '2025',
    icon: '🏆',
  },
];

const SLIDE_INTERVAL = 2200; // ms per slide
const RETURN_DELAY  = 1000;  // ms to show grid again after last slide

function CertificatesSection({ isInView }) {
  // null = grid view, 0-3 = slideshow active on that index
  const [activeIdx, setActiveIdx] = useState(null);
  const timerRef  = useRef(null);

  /* ── start slideshow from a card ── */
  const startSlideshow = (startIdx) => {
    setActiveIdx(startIdx);
  };

  /* ── auto-advance while slideshow is running ── */
  useEffect(() => {
    if (activeIdx === null) return;

    timerRef.current = setTimeout(() => {
      const next = activeIdx + 1;
      if (next < CERTS.length) {
        setActiveIdx(next);
      } else {
        // All done — pause then return to grid
        timerRef.current = setTimeout(() => setActiveIdx(null), RETURN_DELAY);
      }
    }, SLIDE_INTERVAL);

    return () => clearTimeout(timerRef.current);
  }, [activeIdx]);

  /* ── lock scroll when slideshow open ── */
  const isOpen = activeIdx !== null;
  useEffect(() => {
    if (!isOpen) return;
    if (document.body.style.position === 'fixed') return;
    const y = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${y}px`;
    document.body.style.width    = '100%';
    return () => {
      const stored = Math.abs(parseInt(document.body.style.top || '0', 10));
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
      if (stored > 0) window.scrollTo(0, stored);
    };
  }, [isOpen]);

  /* ── keyboard ── */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        clearTimeout(timerRef.current);
        setActiveIdx(null);
      }
      if (e.key === 'ArrowRight') {
        clearTimeout(timerRef.current);
        setActiveIdx(i => (i + 1 < CERTS.length ? i + 1 : null));
      }
      if (e.key === 'ArrowLeft') {
        clearTimeout(timerRef.current);
        setActiveIdx(i => (i - 1 >= 0 ? i - 1 : null));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const close = () => {
    clearTimeout(timerRef.current);
    setActiveIdx(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className="mt-24"
    >
      {/* ── Header ── */}
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

      {/* ── Grid ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CERTS.map((cert, i) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.9 + i * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }}
            onClick={() => startSlideshow(i)}
            className="group relative bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300"
          >
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cert.color} opacity-0 group-hover:opacity-100 transition-opacity z-10`} />

            <div className="relative h-52 overflow-hidden bg-zinc-800">
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
              {/* hover overlay */}
              <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white text-xs font-bold tracking-widest uppercase">Play Slideshow</span>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t ${cert.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            </div>

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

      {/* ── Slideshow Overlay via Portal ── */}
      {activeIdx !== null && createPortal(
        <AnimatePresence>
          <motion.div
            key="cert-slideshow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4"
            onClick={close}
          >
            {/* ── Close button ── */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={close}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-zinc-800 hover:bg-red-500/80 border border-zinc-700 flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* ── Counter ── */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/15">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-white text-sm font-semibold">
                {activeIdx + 1} / {CERTS.length}
              </span>
            </div>

            {/* ── Stack of cards ── */}
            <div
              className="relative w-full max-w-lg"
              style={{ height: '70vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {CERTS.map((cert, i) => {
                const offset = i - activeIdx;
                const isActive = offset === 0;
                const isBehind = offset > 0 && offset <= 2;

                if (offset < 0 || offset > 2) return null; // hide passed & far future

                return (
                  <motion.div
                    key={cert.title}
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                    style={{ originY: 1 }}
                    initial={isActive ? { scale: 0.85, y: 40, opacity: 0 } : false}
                    animate={{
                      scale:   isActive ? 1 : 1 - offset * 0.04,
                      y:       isActive ? 0 : offset * 14,
                      zIndex:  CERTS.length - offset,
                      opacity: isActive ? 1 : isBehind ? 0.5 - offset * 0.15 : 0,
                      rotateX: isActive ? 0 : offset * 2,
                    }}
                    exit={{ scale: 0.85, y: -60, opacity: 0, rotateX: -10 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    onClick={() => {
                      clearTimeout(timerRef.current);
                      const next = activeIdx + 1;
                      if (next < CERTS.length) setActiveIdx(next);
                      else { timerRef.current = setTimeout(() => setActiveIdx(null), RETURN_DELAY); }
                    }}
                  >
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-contain bg-zinc-900"
                      loading="eager"
                      decoding="async"
                    />
                    {/* label on active card */}
                    {isActive && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${cert.color} text-white text-xs font-bold mb-1`}>
                          <span>{cert.icon}</span>
                          <span>{cert.year}</span>
                        </div>
                        <div className="text-white font-bold text-lg">{cert.title}</div>
                        <div className="text-gray-400 text-sm">{cert.issuer}</div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* ── Progress dots ── */}
            <div className="flex gap-2 mt-6">
              {CERTS.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); clearTimeout(timerRef.current); setActiveIdx(i); }}
                  animate={{ width: i === activeIdx ? 24 : 8, opacity: i === activeIdx ? 1 : 0.35 }}
                  transition={{ duration: 0.3 }}
                  className="h-2 rounded-full bg-yellow-400"
                  aria-label={`Go to certificate ${i + 1}`}
                />
              ))}
            </div>

            {/* ── Tap / click hint ── */}
            <p className="mt-4 text-zinc-500 text-xs">
              Tap image to advance &nbsp;·&nbsp; ESC to close
            </p>

            {/* ── Auto-progress bar ── */}
            <motion.div
              key={`progress-${activeIdx}`}
              className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${CERTS[activeIdx]?.color}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }}
            />
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
