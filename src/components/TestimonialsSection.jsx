import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const testimonials = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    role: 'CEO, Tech Startup',
    content: 'Nour delivered an exceptional web application that exceeded our expectations. His attention to detail and technical expertise in front-end development are outstanding.',
    rating: 5,
    image: '/images/testimonial-1.jpg',
    company: 'TechVision'
  },
  {
    id: 2,
    name: 'Sarah Mohamed',
    role: 'Product Manager',
    content: 'Working with Nour was a pleasure. He understood our requirements perfectly and delivered a beautiful, performant solution with clean code and great accessibility.',
    rating: 5,
    image: '/images/testimonial-2.jpg',
    company: 'Digital Solutions'
  },
  {
    id: 3,
    name: 'Omar Ali',
    role: 'Founder, Digital Agency',
    content: 'Highly skilled front-end developer with great communication. The project was completed smoothly with modern best practices and the results were impressive.',
    rating: 5,
    image: '/images/testimonial-3.jpg',
    company: 'Creative Agency'
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

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
  }, [isInView]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" ref={sectionRef} className="min-h-screen py-32 px-6 md:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 overflow-hidden">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-4">
            <div>CLIENT</div>
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              FEEDBACK
            </div>
          </h2>
          <p className="text-gray-500 text-lg uppercase tracking-wider">
            What people say about my work
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Card */}
                <div className="relative bg-zinc-900 p-12 md:p-16 rounded-3xl border border-gray-800 overflow-hidden">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5"></div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/10 to-transparent blur-3xl"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Quote icon */}
                    <motion.div 
                      className="text-8xl text-purple-500/20 mb-6 leading-none"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      "
                    </motion.div>

                    {/* Content */}
                    <motion.p 
                      className="text-2xl md:text-3xl text-gray-300 leading-relaxed mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {currentTestimonial.content}
                    </motion.p>

                    {/* Rating */}
                    <motion.div 
                      className="flex gap-2 mb-8"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <motion.svg
                          key={i}
                          className="w-6 h-6 text-purple-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      ))}
                    </motion.div>

                    {/* Author */}
                    <motion.div 
                      className="flex items-center gap-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                          {currentTestimonial.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-zinc-900"></div>
                      </div>
                      
                      {/* Info */}
                      <div>
                        <h4 className="text-2xl font-bold text-white mb-1">
                          {currentTestimonial.name}
                        </h4>
                        <p className="text-purple-400 font-medium mb-1">
                          {currentTestimonial.role}
                        </p>
                        <p className="text-gray-600 text-sm uppercase tracking-wider">
                          {currentTestimonial.company}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
              <motion.button
                onClick={prevTestimonial}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-zinc-900 border border-gray-800 rounded-full flex items-center justify-center text-purple-400 hover:bg-purple-500/10 hover:border-purple-500 transition-all pointer-events-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <motion.button
                onClick={nextTestimonial}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-zinc-900 border border-gray-800 rounded-full flex items-center justify-center text-purple-400 hover:bg-purple-500/10 hover:border-purple-500 transition-all pointer-events-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-purple-500 w-12'
                    : 'bg-gray-700 w-3 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-8 text-gray-600 text-sm">
            <span className="text-purple-400 font-bold">{currentIndex + 1}</span>
            {' / '}
            {testimonials.length}
          </div>
        </div>
      </div>
    </section>
  );
}
