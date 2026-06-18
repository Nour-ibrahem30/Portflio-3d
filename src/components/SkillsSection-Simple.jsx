import { motion } from 'framer-motion';
import { useState } from 'react';

const skills = [
  { name: 'HTML5', level: 95, icon: '🌐', color: 'from-orange-500 to-red-500', size: 'normal' },
  { name: 'CSS3 / SCSS', level: 95, icon: '🎨', color: 'from-blue-500 to-indigo-500', size: 'normal' },
  { name: 'JavaScript ES6+', level: 90, icon: '⚡', color: 'from-yellow-400 to-orange-400', size: 'wide' },
  { name: 'React', level: 85, icon: '⚛️', color: 'from-cyan-400 to-blue-500', size: 'normal' },
  { name: 'TypeScript', level: 75, icon: '📘', color: 'from-blue-600 to-blue-400', size: 'normal' },
  { name: 'Tailwind CSS', level: 90, icon: '💨', color: 'from-teal-400 to-cyan-500', size: 'normal' },
  { name: 'Bootstrap 5', level: 90, icon: '🅱️', color: 'from-purple-500 to-indigo-500', size: 'normal' },
  { name: 'GSAP', level: 80, icon: '🎬', color: 'from-green-400 to-emerald-500', size: 'normal' },
  { name: 'Framer Motion', level: 80, icon: '🌀', color: 'from-pink-500 to-rose-500', size: 'normal' },
  { name: 'Git & GitHub', level: 85, icon: '🐙', color: 'from-gray-400 to-slate-500', size: 'normal' },
  { name: 'WordPress', level: 75, icon: '📝', color: 'from-blue-400 to-sky-500', size: 'normal' },
  { name: 'Responsive Design', level: 95, icon: '📱', color: 'from-violet-500 to-purple-500', size: 'wide' },
];

const tools = [
  { name: 'VS Code', icon: '💻' },
  { name: 'Figma', icon: '🎨' },
  { name: 'Webpack', icon: '📦' },
  { name: 'Vite', icon: '⚡' },
  { name: 'npm', icon: '📋' },
  { name: 'Firebase', icon: '🔥' },
  { name: 'Supabase', icon: '🟢' },
  { name: 'Clerk', icon: '🔐' },
  { name: 'Chrome DevTools', icon: '🔍' },
  { name: 'Lighthouse', icon: '💡' },
];

export default function SkillsSection() {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  return (
    <section id="skills" className="relative min-h-screen py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-zinc-950 w-full overflow-hidden">
      {/* Background blobs — hidden on mobile */}
      <div className="hidden md:block absolute inset-0 opacity-20 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-4">
            <div>SKILLS &</div>
            <div className="bg-gradient-to-r from-blue-400 via-cyan-400 to-slate-400 bg-clip-text text-transparent">
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
            className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mt-4"
          />
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative group cursor-default ${skill.size === 'wide' ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="relative h-full bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-zinc-600 overflow-hidden transition-all duration-300 p-6 shadow-lg">
                {/* Background gradient on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div className="text-3xl mb-3">{skill.icon}</div>

                {/* Name */}
                <div className="text-white font-bold text-sm mb-3 leading-tight">{skill.name}</div>

                {/* Progress bar */}
                <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.05, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                  />
                </div>

                {/* Level */}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-600">Proficiency</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className={`text-xs font-bold bg-gradient-to-r ${skill.color} bg-clip-text text-transparent`}
                  >
                    {skill.level}%
                  </motion.span>
                </div>

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${skill.color} opacity-5 blur-xl group-hover:opacity-20 transition-opacity`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tools Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 overflow-hidden"
        >
          {/* subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">
                Tools & Environment
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {tools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="group flex flex-col items-center gap-2 px-3 py-4 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-cyan-500/40 rounded-xl cursor-default transition-all duration-200"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    {tool.icon}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-white font-medium text-center leading-tight transition-colors">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
