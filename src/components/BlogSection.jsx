import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const blogPosts = [
  {
    id: 1,
    title: 'Building Accessible Web Applications',
    excerpt: 'Learn how to implement WCAG 2.1 standards and create inclusive web experiences that work for everyone.',
    date: '2025-01-15',
    category: 'Accessibility',
    image: '/images/blog-1.jpg',
    readTime: '6 min read'
  },
  {
    id: 2,
    title: 'Modern CSS Techniques with SCSS',
    excerpt: 'Exploring advanced SCSS features and modern CSS techniques for building scalable and maintainable stylesheets.',
    date: '2025-01-10',
    category: 'CSS',
    image: '/images/blog-2.jpg',
    readTime: '5 min read'
  },
  {
    id: 3,
    title: 'React Best Practices for 2025',
    excerpt: 'Essential patterns and techniques for building performant and maintainable React applications.',
    date: '2025-01-05',
    category: 'React',
    image: '/images/blog-3.jpg',
    readTime: '7 min read'
  },
];

export default function BlogSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState(null);

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

  return (
    <section id="blog" ref={sectionRef} className="min-h-screen py-32 px-6 md:px-12 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 overflow-hidden">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-4">
            <div>LATEST</div>
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              INSIGHTS
            </div>
          </h2>
          <p className="text-gray-500 text-lg uppercase tracking-wider">
            Thoughts on development & design
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 bg-zinc-900 rounded-lg overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40"
                  animate={{ scale: hoveredIndex === index ? 1.1 : 1 }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Category badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                  <span className="text-xs text-purple-400 uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                {/* Date */}
                <div className="absolute bottom-4 left-4 text-sm text-gray-400">
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{post.readTime}</span>
                  <motion.div
                    animate={{ x: hoveredIndex === index ? 5 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-purple-400"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
