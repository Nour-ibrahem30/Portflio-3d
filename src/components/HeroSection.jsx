import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import MagneticButton from './MagneticButton';

export default function HeroSection() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Animated text typing effect
  const [displayText, setDisplayText] = useState('');
  const fullText = 'NOUR IBRAHEM';
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.from('.hero-badge', {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    })
    .from('.hero-title-line', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out'
    }, '-=0.4')
    .from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-cta', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.7)'
    }, '-=0.4')
    .from('.hero-stats', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4');
  }, []);

  // Canvas Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Connect particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.section 
      ref={heroRef}
      style={{ y, opacity }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
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
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-3xl"
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
          className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        {/* Animated Badge */}
        <motion.div
          className="hero-badge inline-block mb-8"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative px-8 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-full backdrop-blur-sm overflow-hidden group">
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
            <div className="relative flex items-center gap-3">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">
                Available for Freelance & Full-Time
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Title with 3D Effect */}
        <div className="mb-8 overflow-hidden perspective-1000">
          <motion.div
            style={{
              rotateX: mousePosition.y * 0.5,
              rotateY: mousePosition.x * 0.5,
            }}
            className="transform-gpu"
          >
            <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-bold leading-none">
              <div className="hero-title-line">
                <span className="inline-block bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent animate-gradient">
                  {displayText.split(' ')[0] || ''}
                </span>
              </div>
              <div className="hero-title-line mt-4">
                <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  {displayText.split(' ')[1] || ''}
                </span>
              </div>
            </h1>
          </motion.div>
        </div>

        {/* Subtitle with Glitch Effect */}
        <div className="hero-subtitle space-y-6 mb-12">
          <motion.div
            animate={{
              backgroundPosition: ['0%', '100%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="relative inline-block"
          >
            <h2 className="text-2xl md:text-4xl text-gray-300 uppercase tracking-widest font-light">
              Front-End Developer & UI Specialist
            </h2>
            <motion.div
              animate={{
                scaleX: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            />
          </motion.div>

          {/* Tech Stack Pills */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {['React', 'TypeScript', 'Tailwind', 'GSAP'].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all cursor-default backdrop-blur-sm"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-6 mb-16 flex-wrap">
          <MagneticButton className="hero-cta group relative px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold uppercase tracking-wider overflow-hidden shadow-lg shadow-purple-500/50">
            <a href="#projects" className="relative z-10 flex items-center gap-3">
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
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </MagneticButton>

          <MagneticButton className="hero-cta group px-10 py-5 border-2 border-purple-500 text-purple-400 rounded-full font-semibold uppercase tracking-wider hover:bg-purple-500/10 transition-all backdrop-blur-sm">
            <a href="#contact" className="flex items-center gap-3">
              <span>Get In Touch</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </MagneticButton>

          <MagneticButton className="hero-cta group px-10 py-5 bg-zinc-900/50 border border-zinc-800 text-white rounded-full font-semibold uppercase tracking-wider hover:border-purple-500 hover:bg-zinc-800/50 transition-all backdrop-blur-sm">
            <a href="/Nour_Ibrahem_CV.pdf" download className="flex items-center gap-3">
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
          </MagneticButton>
        </div>

        {/* Stats with Animation */}
        <motion.div
          className="hero-stats flex items-center justify-center gap-12 text-sm text-gray-600"
        >
          {[
            { value: '20+', label: 'Projects Completed' },
            { value: '2+', label: 'Years Experience' },
            { value: '50+', label: 'Students Guided' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex flex-col items-center gap-2 cursor-default"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2 + index * 0.2, type: 'spring' }}
                className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                {stat.value}
              </motion.div>
              <div className="uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="text-xs uppercase tracking-widest">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
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
