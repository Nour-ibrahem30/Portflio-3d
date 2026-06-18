import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function ImageLightbox({ images, isOpen, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction,    setDirection]    = useState(0);
  const [imgState,     setImgState]     = useState('loading'); // 'loading' | 'loaded' | 'error'
  const preloadedRef = useRef(new Set());

  /* ── sync index when lightbox opens ── */
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setImgState('loading');
    }
  }, [initialIndex, isOpen]);

  /* ── preload adjacent images ── */
  useEffect(() => {
    if (!isOpen || !images.length) return;
    const toPreload = [
      currentIndex,
      (currentIndex + 1) % images.length,
      (currentIndex - 1 + images.length) % images.length,
    ];
    toPreload.forEach(i => {
      if (!preloadedRef.current.has(i)) {
        const img = new Image();
        img.src = images[i];
        preloadedRef.current.add(i);
      }
    });
  }, [currentIndex, images, isOpen]);

  /* ── reset img state on index change ── */
  useEffect(() => {
    setImgState('loading');
  }, [currentIndex]);

  /* ── lock scroll ── */
  useEffect(() => {
    if (!isOpen) return;
    // If body is already fixed (parent modal locked scroll), don't interfere
    if (document.body.style.position === 'fixed') return;
    const y = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${y}px`;
    document.body.style.width    = '100%';
    return () => {
      const stored = Math.abs(parseInt(document.body.style.top || '0', 10));
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
      window.scrollTo(0, stored);
    };
  }, [isOpen]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex(p => (p + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(p => (p - 1 + images.length) % images.length);
  }, [images.length]);

  /* ── keyboard ── */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = e => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, next, prev, onClose]);

  /* ── swipe ── */
  useEffect(() => {
    if (!isOpen) return;
    let startX = 0;
    const onTS = e => { startX = e.touches[0].clientX; };
    const onTE = e => {
      const d = startX - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50) d > 0 ? next() : prev();
    };
    window.addEventListener('touchstart', onTS, { passive: true });
    window.addEventListener('touchend',   onTE, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTS);
      window.removeEventListener('touchend',   onTE);
    };
  }, [isOpen, next, prev]);

  if (!isOpen || !images.length) return null;

  const slideVariants = {
    enter:  d => ({ opacity: 0, x: d > 0 ?  80 : -80 }),
    center: () => ({ opacity: 1, x: 0 }),
    exit:   d => ({ opacity: 0, x: d > 0 ? -80 :  80 }),
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="lb-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[99999] flex flex-col bg-black/97 backdrop-blur-xl"
        style={{ touchAction: 'none' }}
        onClick={onClose}
      >
        {/* ── top bar ── */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/15">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white text-sm font-semibold">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-red-500/80 rounded-full border border-white/15 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </motion.button>
        </div>

        {/* ── main image ── */}
        <div
          className="relative flex-1 flex items-center justify-center px-12 sm:px-16 min-h-0"
          onClick={e => e.stopPropagation()}
        >
          {/* prev */}
          {images.length > 1 && (
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="absolute left-2 sm:left-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/25 rounded-full border border-white/15"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
              </svg>
            </motion.button>
          )}

          {/* image slot */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* spinner */}
            {imgState === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full"
                />
              </div>
            )}

            {/* error */}
            {imgState === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span className="text-sm">Image unavailable</span>
              </div>
            )}

            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                src={images[currentIndex]}
                alt={`Photo ${currentIndex + 1} of ${images.length}`}
                /* eager — never lazy inside a modal */
                loading="eager"
                decoding="async"
                className="max-w-full max-h-full object-contain rounded-xl select-none"
                style={{
                  maxHeight: 'calc(100vh - 180px)',
                  opacity: imgState === 'loaded' ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                }}
                draggable={false}
                onLoad={() => setImgState('loaded')}
                onError={() => setImgState('error')}
              />
            </AnimatePresence>
          </div>

          {/* next */}
          {images.length > 1 && (
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={next}
              className="absolute right-2 sm:right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/25 rounded-full border border-white/15"
              aria-label="Next"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
              </svg>
            </motion.button>
          )}
        </div>

        {/* ── thumbnails ── */}
        {images.length > 1 && (
          <div
            className="flex-shrink-0 pb-4 pt-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center">
              <div className="flex gap-2 px-4 py-3 bg-white/8 rounded-2xl border border-white/10 max-w-[90vw] overflow-x-auto scrollbar-none">
                {images.map((src, i) => (
                  <ThumbnailBtn
                    key={i}
                    src={src}
                    active={i === currentIndex}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    label={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            {/* keyboard hint */}
            <div className="hidden md:flex items-center justify-center gap-4 mt-2 text-white/30 text-xs">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/15 rounded text-xs">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/15 rounded text-xs">→</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/15 rounded text-xs">ESC</kbd>
                Close
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* small thumbnail button with its own load state */
function ThumbnailBtn({ src, active, onClick, label }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={active ? { boxShadow: '0 0 0 2px #22d3ee' } : {}}
      className={`relative flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800 transition-all duration-200 ${
        active ? 'w-16 h-12 opacity-100' : 'w-12 h-10 opacity-40 hover:opacity-70'
      }`}
      aria-label={label}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-700 animate-pulse" />
      )}
      <img
        src={src}
        alt={label}
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover"
        onLoad={() => setLoaded(true)}
      />
    </motion.button>
  );
}
