import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: 'Frontend',
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'HTML5', level: 95 },
      { name: 'CSS3 / SCSS', level: 95 },
      { name: 'JavaScript (ES6+)', level: 90 },
      { name: 'React', level: 85 },
      { name: 'TypeScript', level: 75 },
      { name: 'Bootstrap 5', level: 90 },
    ]
  },
  {
    title: 'Development',
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Responsive Design', level: 95 },
      { name: 'Mobile-First', level: 90 },
      { name: 'Cross-Browser', level: 85 },
      { name: 'Performance Optimization', level: 80 },
    ]
  },
  {
    title: 'Tools & Others',
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Git & GitHub', level: 85 },
      { name: 'VS Code', level: 90 },
      { name: 'Webpack', level: 70 },
      { name: 'WordPress', level: 75 },
      { name: 'WCAG Accessibility', level: 80 },
    ]
  }
];

export default function SkillsSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

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

    if (isInView) {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
            y: 80,
            opacity: 0,
            duration: 1,
            delay: index * 0.2,
            ease: 'power3.out'
          });
        }
      });
    }
  }, [isInView]);

  return (
    <section id="skills" ref={sectionRef} className="relative min-h-screen py-32 px-6 md:px-12 bg-zinc-950 w-full">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        <div ref={titleRef} className="mb-20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-4">
              <div>SKILLS &</div>
              <div className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                EXPERTISE
              </div>
            </h2>
            <p className="text-gray-500 text-lg uppercase tracking-wider">
              Technologies & Tools I Work With
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: '200px' } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4"
            />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              ref={el => cardsRef.current[categoryIndex] = el}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              {/* Card */}
              <div className="relative bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700 hover:border-purple-500/50 overflow-hidden transition-all duration-300 shadow-xl">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Title */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <span className="text-2xl font-bold text-white">
                        {categoryIndex + 1}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills */}
                  <div className="space-y-6">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skill.name}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-300">
                            {skill.name}
                          </span>
                          <span className="text-xs text-gray-500 font-semibold">
                            {skill.level}%
                          </span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                            transition={{ 
                              delay: categoryIndex * 0.2 + skillIndex * 0.1,
                              duration: 1,
                              ease: 'easeOut'
                            }}
                            className={`h-full bg-gradient-to-r ${category.color} rounded-full relative`}
                          >
                            {/* Shine effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{ x: ['-100%', '200%'] }}
                              transition={{
                                delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.5,
                                duration: 1,
                                ease: 'easeInOut'
                              }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.color} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
