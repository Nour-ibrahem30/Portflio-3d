import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ImageLightbox({ images, isOpen, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl"
        onClick={onClose}
      >
        {/* Close button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 transition-all"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        {/* Image counter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-6 z-50 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
        >
          <span className="text-white font-semibold">
            {currentIndex + 1} / {images.length}
          </span>
        </motion.div>

        {/* Main image container */}
        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-20" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="relative max-w-7xl max-h-full"
            >
              <img
                src={images[currentIndex]}
                alt={`Photo ${currentIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                loading="lazy"
              />

              {/* Image glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-pink-500/20 rounded-2xl pointer-events-none blur-3xl -z-10" />
            </motion.div>
          </AnimatePresence>

          {/* Previous button */}
          {images.length > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 md:left-8 w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 md:right-8 w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="flex gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-[90vw] overflow-x-auto">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    index === currentIndex
                      ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-black/50'
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {index === currentIndex && (
                    <motion.div
                      layoutId="activeThumbnail"
                      className="absolute inset-0 border-2 border-purple-400 rounded-lg"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Keyboard hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-4 text-white/50 text-sm"
        >
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">←</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">→</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">ESC</kbd>
            <span>Close</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
