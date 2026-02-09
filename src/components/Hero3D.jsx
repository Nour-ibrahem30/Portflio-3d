import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';

// Constellation Animation Component
function HeroConstellation({ children }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Track mouse position
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.pushRadius = 100; // Reduced push radius
      }

      update() {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Gentle push away from mouse
        if (distance < this.pushRadius) {
          const force = (this.pushRadius - distance) / this.pushRadius;
          const pushX = (dx / distance) * force * 5; // Reduced force
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
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#fff';
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const stars = Array.from({ length: 80 }, () => new Star()); // زودت العدد لـ 80

    let animationId;
    let lastTime = 0;
    const fps = 60;
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
      const connectionDistance = 150;
      stars.forEach((star1, i) => {
        // Only check next few stars to reduce calculations
        const checkLimit = Math.min(i + 10, stars.length);
        for (let j = i + 1; j < checkLimit; j++) {
          const star2 = stars[j];
          const dx = star1.x - star2.x;
          const dy = star1.y - star2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3;
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
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

  // Smooth mouse tracking
  const springConfig = { stiffness: 150, damping: 15 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x * 50);
      mouseY.set(y * 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // GSAP Animations for content
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.from('.hero-badge', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(2)'
    })
    .from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    }, '-=0.3')
    .from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-cta', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.4');
  }, []);

  const animationNames = [
    { icon: '⭐', name: 'Constellation' }
  ];

  return (
    <motion.section
      ref={heroRef}
      style={{ y, scale }}
      className="relative min-h-screen flex items-center justify-center w-full bg-black"
    >
      {/* Constellation Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
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
              linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            transform: `perspective(1000px) rotateX(60deg) translateZ(-200px)`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        {/* Badge - Moved to Top */}
        <motion.div
          className="hero-badge inline-block mb-8"
          style={{ marginTop: '-80px' }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative px-6 py-2.5 bg-zinc-900 border border-purple-500/50 rounded-full backdrop-blur-xl shadow-2xl">
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

        {/* Title with 3D Effect */}
        <motion.div
          className="hero-title mb-8"
          style={{
            rotateX: useTransform(mouseY, [-50, 50], [5, -5]),
            rotateY: useTransform(mouseX, [-50, 50], [-5, 5]),
          }}
        >
          <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-bold leading-none">
            <motion.div
              className="inline-block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #fff, #a855f7, #ec4899, #fff)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              NOUR
            </motion.div>
            <br />
            <motion.div
              className="inline-block mt-4"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
                delay: 0.5,
              }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #a855f7, #ec4899, #3b82f6, #a855f7)',
                backgroundSize: '200% 100%',
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
        <div className="hero-subtitle space-y-6 mb-12">
          <motion.h2
            className="text-2xl md:text-4xl text-gray-300 uppercase tracking-[0.3em] font-light"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            Front-End Developer
          </motion.h2>

          {/* Floating Tech Stack */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['React', 'TypeScript', 'Tailwind', 'GSAP'].map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + i * 0.1 }}
                whileHover={{ y: -10, scale: 1.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity" />
                <div className="relative px-6 py-3 bg-zinc-900 border border-zinc-700 rounded-full backdrop-blur-xl shadow-2xl group-hover:border-purple-500 group-hover:bg-zinc-800 transition-all">
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                    {tech}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-6 flex-wrap mb-16">
          <motion.button
            className="hero-cta group relative px-10 py-5 overflow-hidden rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <a href="#projects" className="relative z-10 flex items-center gap-3 text-white font-semibold uppercase tracking-wider">
              <span>View Work</span>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </a>
          </motion.button>

          <motion.button
            className="hero-cta group relative px-10 py-5 border-2 border-purple-500 rounded-full overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <a href="#contact" className="relative z-10 flex items-center gap-3 text-purple-400 group-hover:text-white font-semibold uppercase tracking-wider transition-colors">
              <span>Get In Touch</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </motion.button>

          <motion.button
            className="hero-cta group relative px-10 py-5 bg-zinc-900/50 border border-zinc-700 rounded-full backdrop-blur-sm overflow-hidden"
            whileHover={{ scale: 1.05, borderColor: '#a855f7' }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/Nour_Ibrahem_CV.pdf" download className="relative z-10 flex items-center gap-3 text-white font-semibold uppercase tracking-wider">
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </motion.svg>
              <span>Download CV</span>
            </a>
          </motion.button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="flex items-center justify-center gap-8 md:gap-12 flex-wrap mb-20"
        >
          {[
            { value: '20+', label: 'Projects' },
            { value: '2+', label: 'Years' },
            { value: '50+', label: 'Students' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.1, y: -5 }}
              className="relative group"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Card */}
              <div className="relative px-8 py-6 bg-zinc-900 border border-zinc-800 rounded-2xl backdrop-blur-xl shadow-2xl group-hover:border-purple-500/70 transition-all">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 uppercase tracking-wider text-xs font-semibold">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator - Attached */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#about"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors cursor-pointer"
          >
            <span className="text-xs uppercase tracking-widest font-semibold">Scroll Down</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.a>
        </motion.div>


      </div>

      {/* Floating Elements */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </motion.section>
  );
}
