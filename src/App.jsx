import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';
import SEO from './components/SEO';
import Navigation from './components/Navigation';
import HeroSection from './components/Hero3D';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection-Simple';
import TimelineSection from './components/TimelineSection-Enhanced';
import ProjectsSection from './components/ProjectsSection-Enhanced';
import BlogSection from './components/BlogSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Track active section with throttle for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
          const scrollPosition = window.scrollY + 200;

          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ErrorBoundary>
      <SEO />
      
      <AnimatePresence>
        {isLoading && (
          <PageLoader onLoadComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen bg-black text-white w-full"
      >
        {/* Version Badge */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="fixed top-20 left-6 z-50"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative px-4 py-2 bg-zinc-900 border border-purple-500/50 rounded-full backdrop-blur-xl shadow-lg flex items-center gap-2">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
              />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Beta v 0.2.20
              </span>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <Navigation activeSection={activeSection} />

        {/* Back to Top Button Only */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: activeSection !== 'home' ? 1 : 0,
            scale: activeSection !== 'home' ? 1 : 0
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>

        <main className="relative z-10">
          <div id="home">
            <HeroSection />
          </div>
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <TimelineSection />
          <ContactSection />
        </main>

        <footer className="relative z-10 py-12 px-6 text-center border-t border-gray-900 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Nour Ibrahem
              </div>
              
              <div className="flex gap-6">
                <a
                  href="https://github.com/Nour-ibrahem30"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-400 transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/nour-ibrahem-499172346"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href="mailto:nouribrahem207@gmail.com"
                  className="text-gray-600 hover:text-purple-400 transition-colors"
                  aria-label="Email"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <p className="text-gray-600 uppercase tracking-widest text-sm">
              © 2025 Nour Ibrahem Mohamed — Front-End Developer | Cairo, Egypt
            </p>
            <p className="text-gray-700 text-xs mt-2">
              Beta v 0.2.20 — Work in Progress
            </p>
          </div>
        </footer>
      </motion.div>
    </ErrorBoundary>
  );
}

export default App;
