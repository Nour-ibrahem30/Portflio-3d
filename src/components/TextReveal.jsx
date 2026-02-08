import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const words = ref.current.querySelectorAll('.word');
      
      gsap.from(words, {
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        rotateX: -90,
        stagger: 0.05,
        duration: 0.8,
        delay: delay,
        ease: 'power4.out'
      });
    }
  }, [isInView, delay]);

  const splitText = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="word inline-block" style={{ perspective: '1000px' }}>
        {word}&nbsp;
      </span>
    ));
  };

  return (
    <div ref={ref} className={className}>
      {typeof children === 'string' ? splitText(children) : children}
    </div>
  );
}
