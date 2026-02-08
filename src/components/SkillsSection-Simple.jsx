import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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
      { name: 'Tailwind CSS', level: 90 },
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

// Animation Variants
const cardVariants = [
  // Variant 0: Slide from bottom
  {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15 } })
  },
  // Variant 1: Slide from sides (alternating)
  {
    hidden: (i) => ({ opacity: 0, x: i % 2 === 0 ? -100 : 100 }),
    visible: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.6, delay: i * 0.15 } })
  },
  // Variant 2: Scale & Rotate
  {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: (i) => ({ opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.8, delay: i * 0.15, type: 'spring' } })
  },
  // Variant 3: Blur & Zoom
  {
    hidden: { opacity: 0, scale: 2, filter: 'blur(20px)' },
    visible: (i) => ({ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.7, delay: i * 0.15 } })
  },
  // Variant 4: Flip
  {
    hidden: { opacity: 0, rotateY: 90 },
    visible: (i) => ({ opacity: 1, rotateY: 0, transition: { duration: 0.8, delay: i * 0.15 } })
  }
];

export default function SkillsSection() {
  const [animationVariant, setAnimationVariant] = useState(0);

  useEffect(() => {
    const variant = Math.floor(Math.random() * cardVariants.length);
    setAnimationVariant(variant);
  }, []);

  return (
    <section id="skills" className="relative min-h-screen py-32 px-6 md:px-12 bg-zinc-950 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
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

      <div className="relative max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
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
            whileInView={{ width: '200px' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4"
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              custom={categoryIndex}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants[animationVariant]}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700 hover:border-purple-500/50 overflow-hidden transition-all duration-300 shadow-xl">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Title */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
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
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ 
                              delay: categoryIndex * 0.15 + skillIndex * 0.08,
                              duration: 0.8,
                              ease: 'easeOut'
                            }}
                            className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                          />
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
