import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HeroAnimated() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  useEffect(() => {
    const timer1 = setInterval(() => {
      setCount1(prev => prev < 3 ? prev + 1 : 3);
    }, 100);
    const timer2 = setInterval(() => {
      setCount2(prev => prev < 20 ? prev + 1 : 20);
    }, 50);
    const timer3 = setInterval(() => {
      setCount3(prev => prev < 15 ? prev + 1 : 15);
    }, 70);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 relative w-full">
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <motion.div 
        className="container mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-8 inline-block"
          variants={itemVariants}
        >
          <motion.div 
            className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 p-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-6xl">
              👨‍💻
            </div>
          </motion.div>
        </motion.div>

        <motion.h1 
          className="text-7xl md:text-9xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Nour Ibrahim
        </motion.h1>

        <motion.div 
          className="text-2xl md:text-4xl mb-8 text-gray-300 font-light"
          variants={itemVariants}
        >
          <TypewriterText />
        </motion.div>

        <motion.p 
          className="text-xl md:text-2xl mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          مطور ويب متخصص في بناء تطبيقات حديثة وتفاعلية
          <br/>
          شغوف بالتقنية والابتكار
        </motion.p>

        <motion.div 
          className="flex gap-6 justify-center flex-wrap"
          variants={itemVariants}
        >
          <motion.a 
            href="#projects" 
            className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-bold text-lg shadow-lg flex items-center gap-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>استكشف مشاريعي</span>
            <motion.svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </motion.svg>
          </motion.a>
          <motion.a 
            href="#contact" 
            className="px-8 py-4 border-2 border-cyan-400 rounded-full font-bold text-lg"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
            whileTap={{ scale: 0.95 }}
          >
            تواصل معي
          </motion.a>
        </motion.div>

        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          <StatCard number={count1} label="سنوات خبرة" color="cyan" delay={0} />
          <StatCard number={count2} label="مشروع" color="purple" delay={0.1} />
          <StatCard number={count3} label="عميل" color="pink" delay={0.2} />
          <StatCard number="100%" label="رضا" color="yellow" delay={0.3} />
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.div>
    </section>
  );
}

function TypewriterText() {
  const texts = [
    'Full Stack Developer',
    'Frontend Specialist', 
    'Backend Engineer',
    'UI/UX Enthusiast'
  ];
  
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length + 1));
        if (displayText === currentText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentText.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex]);

  return (
    <>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        |
      </motion.span>
    </>
  );
}

function StatCard({ number, label, color, delay }) {
  return (
    <motion.div 
      className={`p-6 rounded-2xl bg-gradient-to-br from-${color}-500/10 to-transparent border border-${color}-500/30 backdrop-blur-sm`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3)`
      }}
    >
      <motion.div 
        className={`text-5xl font-black text-${color}-400 mb-2`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {number}
      </motion.div>
      <div className="text-gray-400">{label}</div>
    </motion.div>
  );
}
