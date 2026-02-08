import { motion } from 'framer-motion'

function About() {
  return (
    <section className="section">
      <motion.div 
        className="content"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>عني</h2>
        <p>
          أنا مطور ويب شغوف بإنشاء تجارب رقمية فريدة وتفاعلية. أتخصص في تطوير 
          واجهات المستخدم ثلاثية الأبعاد باستخدام Three.js و React.
        </p>
        <p>
          لدي خبرة واسعة في تطوير تطبيقات الويب الحديثة، وأسعى دائماً لتعلم 
          تقنيات جديدة وتحسين مهاراتي.
        </p>
        <p>
          أؤمن بأن التصميم الجيد والكود النظيف هما أساس أي مشروع ناجح.
        </p>
      </motion.div>
    </section>
  )
}

export default About
