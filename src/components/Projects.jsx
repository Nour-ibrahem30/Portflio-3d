import { motion } from 'framer-motion'

function Projects() {
  const projects = [
    {
      title: 'متجر إلكتروني ثلاثي الأبعاد',
      description: 'منصة تسوق تفاعلية مع عرض المنتجات بتقنية 3D',
      tech: 'React, Three.js, Node.js'
    },
    {
      title: 'لعبة ويب تفاعلية',
      description: 'لعبة مغامرات ثلاثية الأبعاد تعمل على المتصفح',
      tech: 'Three.js, WebGL, JavaScript'
    },
    {
      title: 'تطبيق إدارة مشاريع',
      description: 'نظام شامل لإدارة المشاريع والفرق',
      tech: 'React, MongoDB, Express'
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
          المشاريع
        </motion.h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="project-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 style={{ marginBottom: '1rem', color: '#00f5ff' }}>{project.title}</h3>
              <p style={{ marginBottom: '1rem' }}>{project.description}</p>
              <p style={{ fontSize: '0.9rem', color: '#ff00ff' }}>{project.tech}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
