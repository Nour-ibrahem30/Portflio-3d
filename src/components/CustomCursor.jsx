import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible,  setIsVisible]  = useState(false);

  // Ring — slow/lagging follower
  const ringX = useMotionValue(-200);
  const ringY = useMotionValue(-200);
  const smoothRingX = useSpring(ringX, { stiffness: 120, damping: 22, mass: 0.6 });
  const smoothRingY = useSpring(ringY, { stiffness: 120, damping: 22, mass: 0.6 });

  // Dot — snappy
  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);
  const smoothDotX = useSpring(dotX, { stiffness: 600, damping: 30 });
  const smoothDotY = useSpring(dotY, { stiffness: 600, damping: 30 });

  useEffect(() => {
    const onMove = (e) => {
      setIsVisible(true);
      ringX.set(e.clientX - 20);
      ringY.set(e.clientY - 20);
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp   = () => setIsClicking(false);

    const onMouseOver = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]');
      setIsHovering(!!el);
    };

    window.addEventListener('mousemove', onMove,     { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup',   onMouseUp);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup',   onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [ringX, ringY, dotX, dotY]);

  return (
    <>
      {/* ── Outer Ring ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100000] hidden lg:block"
        style={{ x: smoothRingX, y: smoothRingY }}
        animate={{
          width:   isHovering ? 52 : isClicking ? 28 : 40,
          height:  isHovering ? 52 : isClicking ? 28 : 40,
          opacity: isVisible  ? 1  : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: isHovering
              ? '1.5px solid rgba(34,211,238,0.9)'
              : '1.5px solid rgba(99,102,241,0.7)',
            boxShadow: isHovering
              ? '0 0 12px rgba(34,211,238,0.35), inset 0 0 12px rgba(34,211,238,0.08)'
              : '0 0 8px rgba(99,102,241,0.2)',
          }}
          animate={{ rotate: isHovering ? 360 : 0 }}
          transition={
            isHovering
              ? { duration: 2, repeat: Infinity, ease: 'linear' }
              : { duration: 0.3 }
          }
        />
        {/* Inner fill on hover */}
        <motion.div
          className="absolute inset-2 rounded-full"
          animate={{ backgroundColor: isHovering ? 'rgba(34, 211, 238, 0.08)' : 'rgba(34, 211, 238, 0)' }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* ── Center Dot ── */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[100001] hidden lg:block"
        style={{ x: smoothDotX, y: smoothDotY }}
        animate={{
          scale:   isClicking ? 0.5 : isHovering ? 0 : 1,
          opacity: isVisible  ? 1  : 0,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:  isHovering ? '#22d3ee' : '#8b5cf6',
            boxShadow:   isHovering
              ? '0 0 8px rgba(34,211,238,0.8)'
              : '0 0 6px rgba(139,92,246,0.6)',
          }}
        />
      </motion.div>
    </>
  );
}
