import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    year: '2026',
    title: 'Technical Contributor',
    company: 'GDG Banha Event',
    location: 'Benha University',
    period: 'June 2026',
    description: 'Fully guided 50+ participants through the Front-End track (HTML, CSS). Assisted attendees in debugging projects and implementing responsive layouts. Explained front-end concepts and best practices in a practical environment.',
    skills: ['HTML5', 'CSS3', 'Teaching', 'Mentoring', 'Debugging'],
    type: 'event'
  },
  {
    year: '2025',
    title: 'Front-End Developer',
    company: 'Value Marketing',
    location: 'Cairo, Egypt',
    period: 'Sep 2025 – Present',
    description: 'Develop and maintain responsive web interfaces using HTML, CSS, JavaScript and React. Customize and manage WordPress themes for content and layout requirements.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'WordPress'],
    type: 'work'
  },
  {
    year: '2024',
    title: 'Freelance Front-End Developer',
    company: 'Remote',
    location: 'Remote',
    period: '2024 – Present',
    description: 'Built 20+ responsive websites using semantic HTML, SCSS, JavaScript, and React. Developed interactive, user-friendly interfaces with a focus on performance and usability.',
    skills: ['HTML5', 'SCSS', 'JavaScript', 'React', 'Mobile-First'],
    type: 'work'
  },
  {
    year: '2025',
    title: 'Front-End Development Intern',
    company: 'Web Master Company',
    location: 'Cairo, Egypt',
    period: '2025',
    description: 'Completed hands-on training in front-end development using HTML, CSS, JavaScript, and React fundamentals. Collaborated with team members to build and deliver responsive layouts.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    type: 'internship'
  },
  {
    year: '2025',
    title: 'Core Team Member',
    company: 'Ministry of Youth and Sports (YLY Initiative)',
    location: 'Cairo, Egypt',
    period: '2025 – Present',
    description: 'Contribute to planning and executing youth-focused initiatives and events. Coordinate with team members to ensure smooth implementation and successful outcomes.',
    skills: ['Team Coordination', 'Event Planning', 'Communication'],
    type: 'volunteer'
  },
  {
    year: '2025',
    title: 'Volunteer Front-End Developer',
    company: 'Shabab Betesaed Shabab',
    location: 'Remote',
    period: '2025',
    description: 'Contributed to front-end development using HTML, CSS, JavaScript, TypeScript and React. Assisted in designing and improving web solutions for community initiatives.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React'],
    type: 'volunteer'
  },
];

const typeColors = {
  work: 'from-blue-500 to-cyan-500',
  event: 'from-purple-500 to-pink-500',
  internship: 'from-green-500 to-emerald-500',
  volunteer: 'from-orange-500 to-yellow-500'
};

export default function TimelineSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const itemsRef = useRef([]);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

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

    if (isInView && lineRef.current) {
      gsap.from(lineRef.current, {
        scrollTrigger: {
          trigger: lineRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
        scaleY: 0,
        transformOrigin: 'top',
      });
    }

    if (isInView) {
      itemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.from(item, {
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            },
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
          });
        }
      });
    }
  }, [isInView]);

  return (
    <section id="experience" ref={sectionRef} className="relative min-h-screen py-32 px-6 md:px-12 bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-green-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        <div ref={titleRef} className="mb-20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-4">
              <div>MY</div>
              <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                JOURNEY
              </div>
            </h2>
            <p className="text-gray-500 text-lg uppercase tracking-wider">
              Experience & Timeline
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: '200px' } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-4"
            />
          </motion.div>
        </div>

        <div className="relative">
          {/* Timeline line - NO ICONS */}
          <div 
            ref={lineRef}
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-lg shadow-purple-500/50"
          />

          {/* Timeline items */}
          <div className="space-y-24">
            {experiences.map((exp, index) => (
              <motion.div
                key={`${exp.company}-${index}`}
                ref={el => itemsRef.current[index] = el}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Year badge - Simple dot */}
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 z-10"
                >
                  <div className={`w-6 h-6 bg-gradient-to-br ${typeColors[exp.type]} rounded-full shadow-lg border-4 border-black`}>
                    <div className="absolute inset-0 bg-gradient-to-br ${typeColors[exp.type]} rounded-full animate-ping opacity-75"></div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className={`w-full md:w-5/12 ml-20 md:ml-0 ${
                  index % 2 === 0 ? 'md:pr-20 md:text-right' : 'md:pl-20'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ duration: 0.3 }}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    className="relative group"
                  >
                    {/* Card */}
                    <div className="relative bg-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl border border-zinc-700 hover:border-purple-500/50 overflow-hidden transition-all duration-300 shadow-xl">
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[exp.type]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        {/* Year + Type badge */}
                        <div className={`flex items-center gap-3 mb-4 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                          <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${typeColors[exp.type]} text-white`}>
                            {exp.type}
                          </div>
                          <div className="text-gray-600 font-bold">
                            {exp.year}
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                          {exp.title}
                        </h3>
                        
                        <p className="text-purple-400 mb-1 font-semibold">
                          {exp.company}
                        </p>
                        
                        <p className="text-gray-600 text-sm mb-4">
                          📍 {exp.location} • 📅 {exp.period}
                        </p>
                        
                        <p className="text-gray-400 mb-6 leading-relaxed">
                          {exp.description}
                        </p>
                        
                        {/* Skills */}
                        <div className={`flex flex-wrap gap-2 ${
                          index % 2 === 0 ? 'md:justify-end' : ''
                        }`}>
                          {exp.skills.map((skill) => (
                            <motion.span
                              key={skill}
                              whileHover={{ scale: 1.1, y: -2 }}
                              className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-xs font-medium border border-gray-700 hover:border-purple-500 transition-colors"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Decorative corner */}
                      <div className={`absolute ${index % 2 === 0 ? 'top-0 right-0' : 'top-0 left-0'} w-32 h-32 bg-gradient-to-br ${typeColors[exp.type]} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity duration-500`}></div>
                      
                      {/* Number */}
                      <div className={`absolute bottom-4 ${index % 2 === 0 ? 'md:left-4 right-4' : 'md:right-4 right-4'} text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Connecting line to timeline */}
                    <div className={`absolute top-1/2 transform -translate-y-1/2 ${
                      index % 2 === 0 ? 'md:-right-20 -left-12' : 'md:-left-20 -left-12'
                    } w-12 md:w-20 h-px bg-gradient-to-r ${typeColors[exp.type]} opacity-30`}></div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
