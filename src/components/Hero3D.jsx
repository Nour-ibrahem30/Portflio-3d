import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';

// Typewriter Text Component
function TypewriterText() {
  const texts = ['Front-End Developer', 'React Developer', 'UI/UX Engineer', 'Problem Solver'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[currentIndex];
    let timeout;

    if (!isDeleting && charIndex < currentText.length) {
      timeout = setTimeout(() => setCharIndex(prev => prev + 1), 80);
    } else if (!isDeleting && charIndex === currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(prev => prev - 1), 40);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setCurrentIndex(prev => (prev + 1) % texts.length);
    }

    setDisplayText(currentText.substring(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex]);

  return (
    <span>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// Constellation Animation Component - Optimized
function HeroConstellation({ children }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Skip on mobile — saves battery & CPU
    if (window.innerWidth < 768) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Track mouse position with throttle
    let mouseTimeout;
    const handleMouseMove = (e) => {
      if (mouseTimeout) return;
      mouseTimeout = setTimeout(() => {
        mouseRef.current = {
          x: e.clientX,
          y: e.clientY
        };
        mouseTimeout = null;
      }, 16); // ~60fps
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.pushRadius = 100;
      }

      update() {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Gentle push away from mouse
        if (distance < this.pushRadius) {
          const force = (this.pushRadius - distance) / this.pushRadius;
          const pushX = (dx / distance) * force * 5;
          const pushY = (dy / distance) * force * 5;
          
          this.x -= pushX;
          this.y -= pushY;
        } else {
          // Return to base position slowly
          this.x += (this.baseX - this.x) * 0.05;
          this.y += (this.baseY - this.y) * 0.05;
        }

        // Update base position with velocity
        this.baseX += this.vx;
        this.baseY += this.vy;

        // Bounce off edges
        if (this.baseX < 0 || this.baseX > canvas.width) this.vx *= -1;
        if (this.baseY < 0 || this.baseY > canvas.height) this.vy *= -1;

        // Keep within bounds
        this.baseX = Math.max(0, Math.min(canvas.width, this.baseX));
        this.baseY = Math.max(0, Math.min(canvas.height, this.baseY));
      }

      draw() {
        // Draw star with subtle glow
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const stars = Array.from({ length: 40 }, () => new Star()); // Reduced from 60

    let animationId;
    let lastTime = 0;
    const fps = 24; // Reduced from 30
    const frameDelay = 1000 / fps;
    
    function animate(currentTime) {
      // Throttle to 60fps max
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime < frameDelay) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      lastTime = currentTime - (deltaTime % frameDelay);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      // Draw connections (optimized - only check nearby stars)
      const connectionDistance = 100; // Reduced from 120
      const maxConnections = 2; // Limit connections per star - Reduced from 3
      stars.forEach((star1, i) => {
        let connections = 0;
        // Only check next few stars to reduce calculations
        const checkLimit = Math.min(i + 6, stars.length); // Reduced from 8
        for (let j = i + 1; j < checkLimit && connections < maxConnections; j++) {
          const star2 = stars[j];
          const dx = star1.x - star2.x;
          const dy = star1.y - star2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3; // Reduced from 0.35
            ctx.strokeStyle = `rgba(71, 85, 105, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
            connections++;
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    animate(0);

    const handleResize = () => {
      // Debounce resize
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      animationId = requestAnimationFrame(animate);
    };

    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    };

    window.addEventListener('resize', debouncedResize, { passive: true });
    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      clearTimeout(resizeTimeout);
      clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      {children}
    </>
  );
}

export default function Hero3D() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Smooth mouse tracking - optimized
  const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  // Pre-compute title tilt transforms (must be at top level, not inside JSX)
  const titleRotateX = useTransform(mouseY, [-50, 50], [2, -2]);
  const titleRotateY = useTransform(mouseX, [-50, 50], [-2, 2]);

  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        mouseX.set(x * 50);
        mouseY.set(y * 50);
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  // GSAP Animations for content - Optimized with defer
  useEffect(() => {
    // Defer animation until after initial render
    const timeoutId = setTimeout(() => {
      const tl = gsap.timeline({ 
        delay: 0.2,
        defaults: { force3D: true }
      });
      
      tl.from('.hero-badge', {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.out(1.5)',
        clearProps: 'all'
      })
      .from('.hero-title', {
        y: 60,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: 'all'
      }, '-=0.1')
      .from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'all'
      }, '-=0.2')
      .from('.hero-cta', {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        stagger: 0.06,
        ease: 'back.out(1.3)'
      }, '-=0.2');
    }, 150);

    return () => clearTimeout(timeoutId);
  }, []);

  const animationNames = [
    { icon: '⭐', name: 'Constellation' }
  ];

  return (
    <motion.section
      ref={heroRef}
      style={{ y, scale, willChange: 'transform' }}
      className="relative min-h-screen flex items-center justify-center w-full bg-black"
    >
      {/* Constellation Background Animation */}
      <div className="absolute inset-0 overflow-hidden opacity-60">
        <HeroConstellation>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black" />
        </HeroConstellation>
      </div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(71, 85, 105, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(71, 85, 105, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            transform: `perspective(1000px) rotateX(60deg) translateZ(-200px)`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        {/* Badge - At Top */}
        <motion.div
          className="hero-badge inline-block mb-12"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-cyan-700 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative px-6 py-2.5 bg-zinc-900 border border-slate-600/50 rounded-full backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                />
                <span className="text-white text-xs font-semibold uppercase tracking-wider">
                  Available for Work
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title with Gradient */}
        <motion.div
          className="hero-title mb-10"
          style={{
            rotateX: titleRotateX,
            rotateY: titleRotateY,
            willChange: 'transform'
          }}
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-bold leading-none">
            <motion.div
              className="inline-block"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                background: 'linear-gradient(90deg, #c084fc 0%, #22d3ee 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              NOUR
            </motion.div>
            <br />
            <motion.div
              className="inline-block mt-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                background: 'linear-gradient(90deg, #22d3ee 0%, #475569 50%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              IBRAHEM
            </motion.div>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <div className="hero-subtitle space-y-8 mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-light"
          >
            <TypewriterText />
          </motion.h2>

          {/* Tech Stack Pills */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {['React', 'TypeScript', 'Tailwind', 'GSAP'].map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="px-5 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-full backdrop-blur-sm"
              >
                <span className="text-sm font-medium text-gray-300">
                  {tech}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-5 flex-wrap mb-16">
          <motion.a
            href="#projects"
            className="hero-cta group relative px-8 py-4 overflow-hidden rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-cyan-800" />
            <div className="relative z-10 flex items-center gap-2 text-white font-semibold uppercase tracking-wider text-sm">
              <span>View Work</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </motion.a>

          <motion.a
            href="#contact"
            className="hero-cta group relative px-8 py-4 border border-slate-600/50 rounded-full overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-slate-600/10" />
            <div className="relative z-10 flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider text-sm">
              <span>Get In Touch</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </motion.a>

          <motion.a
            href="/Nour_Ibrahem_CV.pdf"
            download
            className="hero-cta group relative px-8 py-4 bg-zinc-900/50 border border-zinc-700/50 rounded-full backdrop-blur-sm overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative z-10 flex items-center gap-2 text-white font-semibold uppercase tracking-wider text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download CV</span>
            </div>
          </motion.a>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex items-center justify-center gap-8 md:gap-16 flex-wrap"
        >
          {[
            { value: '30+', label: 'Projects' },
            { value: '2+', label: 'Years' },
            { value: '50+', label: 'Students' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-gray-500 uppercase tracking-wider text-xs font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>


      </div>

      {/* Floating Elements — desktop only, seeded positions to avoid hydration mismatch */}
      {typeof window !== 'undefined' && window.innerWidth >= 768 && (
        [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{
              left: `${10 + i * 15}%`,
              top:  `${15 + (i % 3) * 25}%`,
            }}
            animate={{ y: [0, -24, 0], opacity: [0, 0.8, 0], scale: [0, 1.2, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))
      )}
    </motion.section>
  );
}








