import { motion } from 'framer-motion'

function Skills() {
  const skills = [
    {
      title: 'تطوير الواجهات',
      description: 'React, Vue.js, HTML5, CSS3, JavaScript',
      icon: '💻'
    },
    {
      title: 'رسومات ثلاثية الأبعاد',
      description: 'Three.js, WebGL, React Three Fiber',
      icon: '🎨'
    },
    {
      title: 'تطوير الخلفية',
      description: 'Node.js, Express, MongoDB, PostgreSQL',
      icon: '⚙️'
    },
    {
      title: 'أدوات التطوير',
      description: 'Git, Docker, Webpack, Vite',
      icon: '🛠️'
    }
  ]

  return (
    <section className="section">
      <div className="content">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          المهارات
        </motion.h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="skill-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{skill.icon}</div>
              <h3 style={{ marginBottom: '0.5rem' }}>{skill.title}</h3>
              <p style={{ fontSize: '1rem', color: '#aaa' }}>{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
