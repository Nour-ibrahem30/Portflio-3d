import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const skillCategories = [
  {
    title: 'Frontend',
    icon: '🎨',
    color: 'cyan',
    skills: ['React', 'Vue.js', 'Next.js', 'Tailwind CSS', 'TypeScript', 'JavaScript']
  },
  {
    title: 'Backend',
    icon: '⚙️',
    color: 'purple',
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL']
  },
  {
    title: 'Tools',
    icon: '🛠️',
    color: 'pink',
    skills: ['Git', 'GitHub', 'Docker', 'VS Code', 'Webpack', 'Vite']
  },
  {
    title: 'Design',
    icon: '✨',
    color: 'yellow',
    skills: ['Figma', 'Adobe XD', 'UI/UX', 'Responsive Design', 'Animation', 'Prototyping']
  }
];

export default function SkillsAnimated() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  return (
    <section id="skills" className="min-h-screen py-20 px-6 relative" ref={ref}>
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            المهارات
          </h2>
          <p className="text-xl text-gray-400">
            التقنيات والأدوات التي أستخدمها
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} variants={cardVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SkillCard({ category, variants }) {
  const colorClasses = {
    cyan: 'from-cyan-500/10 border-cyan-500/30 text-cyan-400 bg-cyan-400',
    purple: 'from-purple-500/10 border-purple-500/30 text-purple-400 bg-purple-400',
    pink: 'from-pink-500/10 border-pink-500/30 text-pink-400 bg-pink-400',
    yellow: 'from-yellow-500/10 border-yellow-500/30 text-yellow-400 bg-yellow-400'
  };

  const colors = colorClasses[category.color];

  return (
    <motion.div
      className={`p-8 rounded-2xl bg-gradient-to-br ${colors.split(' ')[0]} to-transparent border ${colors.split(' ')[1]} backdrop-blur-sm`}
      variants={variants}
      whileHover={{ 
        scale: 1.05,
        y: -10,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="text-6xl mb-4"
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {category.icon}
      </motion.div>
      <h3 className={`text-2xl font-bold mb-6 ${colors.split(' ')[2]}`}>
        {category.title}
      </h3>
      <ul className="space-y-3">
        {category.skills.map((skill, idx) => (
          <motion.li 
            key={skill}
            className="flex items-center gap-3 text-gray-300"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.span 
              className={`w-2 h-2 rounded-full ${colors.split(' ')[3]}`}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: idx * 0.2
              }}
            />
            <span>{skill}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
