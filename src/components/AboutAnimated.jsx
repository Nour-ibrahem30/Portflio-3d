import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutAnimated() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  return (
    <section id="about" className="min-h-screen py-20 px-6 relative" ref={ref}>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="about-image relative"
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="relative w-full aspect-square rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20"></div>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center text-9xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                💻
              </motion.div>
            </motion.div>
            <motion.div 
              className="absolute -top-6 -right-6 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -bottom-6 -left-6 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"
              animate={{
                scale: [1.3, 1, 1.3],
                opacity: [0.6, 0.3, 0.6]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            />
          </motion.div>

          <motion.div 
            className="about-text space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h2 
              className="text-6xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              عني
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 leading-relaxed"
              variants={itemVariants}
            >
              مرحباً! أنا <span className="text-cyan-400 font-bold">نور إبراهيم</span>، 
              مطور ويب شغوف بإنشاء تطبيقات ويب حديثة وتفاعلية.
            </motion.p>

            <motion.p 
              className="text-lg text-gray-400 leading-relaxed"
              variants={itemVariants}
            >
              أتخصص في تطوير الواجهات الأمامية والخلفية باستخدام أحدث التقنيات والأدوات.
              أحب تحويل الأفكار إلى منتجات رقمية عملية وجميلة.
            </motion.p>

            <motion.p 
              className="text-lg text-gray-400 leading-relaxed"
              variants={itemVariants}
            >
              أؤمن بأن الكود النظيف والتصميم الجيد هما مفتاح نجاح أي مشروع.
              دائماً في تعلم مستمر واستكشاف تقنيات جديدة.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4 pt-6"
              variants={itemVariants}
            >
              {['تصميم إبداعي', 'كود نظيف', 'أداء عالي'].map((tag, index) => (
                <motion.div
                  key={tag}
                  className={`px-6 py-3 rounded-xl ${
                    index === 0 ? 'bg-cyan-500/20 border border-cyan-500/30' :
                    index === 1 ? 'bg-purple-500/20 border border-purple-500/30' :
                    'bg-pink-500/20 border border-pink-500/30'
                  }`}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`font-bold ${
                    index === 0 ? 'text-cyan-400' :
                    index === 1 ? 'text-purple-400' :
                    'text-pink-400'
                  }`}>
                    {tag}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
