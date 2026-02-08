import { motion } from 'framer-motion'

function Hero() {
  return (
    <section className="section">
      <motion.div 
        className="content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>مرحباً، أنا [اسمك]</h1>
        <p style={{ fontSize: '1.5rem', color: '#00f5ff' }}>
          مطور ويب متخصص في تطوير تجارب ثلاثية الأبعاد
        </p>
        <p>
          أقوم بتحويل الأفكار إلى تجارب رقمية مذهلة باستخدام أحدث التقنيات
        </p>
      </motion.div>
    </section>
  )
}

export default Hero
