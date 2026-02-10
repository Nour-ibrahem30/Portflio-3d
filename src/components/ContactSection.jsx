import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import MagneticButton from './MagneticButton';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ContactSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState({ name: '', email: '' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      // Check if Firebase is initialized
      if (!db) {
        throw new Error('Firebase is not initialized');
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'contacts'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: serverTimestamp(),
        read: false
      });

      console.log('Document written with ID: ', docRef.id);

      // Store submitted data before clearing form
      setSubmittedData({ name: formData.name, email: formData.email });
      
      // Clear form and show success
      setFormData({ name: '', email: '', message: '' });
      setStatus('success');
      
      // Hide success message after 8 seconds
      setTimeout(() => {
        setStatus('');
        setSubmittedData({ name: '', email: '' });
      }, 8000);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.message);
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      label: 'GitHub',
      value: '@Nour-ibrahem30',
      href: 'https://github.com/Nour-ibrahem30',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Email',
      value: 'nouribrahem207@gmail.com',
      href: 'mailto:nouribrahem207@gmail.com',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Phone',
      value: '+20 114 161 5397',
      href: 'tel:+201141615397',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      label: 'LinkedIn',
      value: 'Nour Ibrahem',
      href: 'https://linkedin.com/in/nour-ibrahem-499172346',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <section id="contact" ref={sectionRef} className="relative min-h-screen py-32 px-6 md:px-12 bg-black w-full">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-4">
              <div>LET'S</div>
              <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                CONNECT
              </div>
            </h2>
            <p className="text-gray-500 text-lg uppercase tracking-wider">
              Get in touch for opportunities
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-8 uppercase tracking-wider">
                Contact Info
              </h3>
            </motion.div>
            
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={index}
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="group relative block p-6 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${method.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-center gap-4">
                    {/* Icon Container */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-14 h-14 bg-gradient-to-br ${method.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
                    >
                      {method.icon}
                    </motion.div>
                    
                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {method.label}
                      </div>
                      <div className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">
                        {method.value}
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <motion.svg
                      className="w-5 h-5 text-gray-600 group-hover:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </div>

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Additional Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Available for Work</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    I'm currently available for freelance projects and full-time opportunities. Let's build something amazing together!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form - Takes 3 columns */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative"
              >
                <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider px-3">
                  Your Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="Enter your name"
                    className="w-full px-6 py-4 bg-zinc-900/50 border-2 border-zinc-800 rounded-xl text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                  {focusedField === 'name' && (
                    <motion.div
                      className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </div>
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="relative"
              >
                <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider px-3">
                  Your Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 bg-zinc-900/50 border-2 border-zinc-800 rounded-xl text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                  {focusedField === 'email' && (
                    <motion.div
                      className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </div>
              </motion.div>

              {/* Message Textarea */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="relative"
              >
                <label className="block text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider px-3">
                  Your Message
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows="6"
                    placeholder="Tell me about your project..."
                    className="w-full px-6 py-4 bg-zinc-900/50 border-2 border-zinc-800 rounded-xl text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition-all duration-300 resize-none backdrop-blur-sm"
                  />
                  {focusedField === 'message' && (
                    <motion.div
                      className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold uppercase tracking-wider overflow-hidden rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && (
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        whileHover={{ x: 5 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    )}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </MagneticButton>
              </motion.div>

              {/* Success Message */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-green-400 font-bold text-xl mb-2">
                        شكراً لك {submittedData.name}! 🎉
                      </div>
                      <div className="text-gray-300 text-base leading-relaxed mb-3">
                        تم استلام رسالتك بنجاح! سأقوم بالرد عليك في أقرب وقت ممكن على البريد الإلكتروني:
                      </div>
                      <div className="text-purple-400 font-semibold text-base mb-3 break-all">
                        {submittedData.email}
                      </div>
                      <div className="text-gray-400 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        عادةً ما أرد خلال 24-48 ساعة
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-red-400 font-semibold uppercase tracking-wider">Error!</div>
                      <div className="text-gray-400 text-sm">Failed to send message. Please try again.</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
