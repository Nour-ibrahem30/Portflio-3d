import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { timelineConfig, typeColors } from '../config/timelineConfig';
import ImageLightbox from './ImageLightbox';
import CustomVideoPlayer from './CustomVideoPlayer';

/* ─────────────────────────────────────────────────────
   Main Section
───────────────────────────────────────────────────── */
export default function TimelineSectionEnhanced() {
  const [lightboxOpen,   setLightboxOpen]   = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex,  setLightboxIndex]  = useState(0);

  const openLightbox = useCallback((images, index = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  return (
    <section id="experience" className="relative min-h-screen py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-black w-full">
      {/* Background blobs — hidden on mobile */}
      <div className="hidden md:block absolute inset-0 opacity-20 pointer-events-none -z-10">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-20 w-96 h-96 bg-green-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], rotate: [0, -90, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-4">
            <div>MY</div>
            <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              JOURNEY
            </div>
          </h2>
          <p className="text-gray-500 text-lg uppercase tracking-wider">
            Experience &amp; Projects Timeline
          </p>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '200px' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-4"
          />
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-900 via-slate-700 to-cyan-800 rounded-full shadow-lg shadow-slate-600/50" />

          <div className="space-y-16">
            {timelineConfig.map((entry, index) => (
              <TimelineEntry
                key={entry.id}
                entry={entry}
                index={index}
                onOpenLightbox={openLightbox}
              />
            ))}
          </div>
        </div>
      </div>

      <ImageLightbox
        images={lightboxImages}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={lightboxIndex}
      />
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   Single Timeline Entry
───────────────────────────────────────────────────── */
function TimelineEntry({ entry, index, onOpenLightbox }) {
  const [modalOpen, setModalOpen] = useState(false);
  const btnRef = useRef(null);

  const hasDetails =
    entry.projects.length > 0 ||
    entry.liveUrls.length > 0 ||
    (entry.eventPhotos?.length ?? 0) > 0 ||
    (entry.eventVideos?.length ?? 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Dot */}
      <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 z-20">
        <div className={`w-6 h-6 bg-gradient-to-br ${typeColors[entry.type]} rounded-full shadow-lg border-4 border-black`} />
      </div>

      {/* Card */}
      <div className={`w-full md:w-5/12 ml-16 sm:ml-20 md:ml-0 ${index % 2 === 0 ? 'md:pr-20 md:text-right' : 'md:pl-20'}`}>
        <div className="relative group">
          {/* Connecting line */}
          <div className={`absolute top-1/2 -translate-y-1/2 ${
            index % 2 === 0 ? 'md:-right-20 -left-12' : 'md:-left-20 -left-12'
          } w-12 md:w-20 h-px bg-gradient-to-r ${typeColors[entry.type]} opacity-30`} />

          <div className="relative bg-zinc-900/90 backdrop-blur-sm p-8 rounded-2xl border border-zinc-700 hover:border-slate-600/50 overflow-hidden transition-all duration-300 shadow-xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[entry.type]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

            <div className="relative z-10">
              {/* Badge + Year */}
              <div className={`flex items-center gap-3 mb-4 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${typeColors[entry.type]} text-white shadow-lg`}>
                  {entry.type}
                </div>
                <div className="text-gray-600 font-bold">{entry.year}</div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-slate-400 group-hover:to-cyan-600 transition-all">
                {entry.title}
              </h3>
              <p className="text-cyan-400 mb-1 font-semibold">{entry.company}</p>
              <p className="text-gray-600 text-sm mb-4">📍 {entry.location} • 📅 {entry.period}</p>
              <p className="text-gray-400 mb-6 leading-relaxed">{entry.description}</p>

              {/* Stats */}
              {entry.stats && (
                <div className={`flex flex-wrap gap-4 mb-6 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                  {Object.entries(entry.stats).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className="text-cyan-400 font-bold">{value}</span>
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                {entry.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-xs font-medium border border-gray-700">
                    {skill}
                  </span>
                ))}
              </div>

              {/* View button */}
              {hasDetails && (
                <div className={`mt-6 pt-6 border-t border-zinc-700 flex ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                  <button
                    ref={btnRef}
                    onClick={() => setModalOpen(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-slate-600/20 hover:bg-slate-600/40 text-cyan-400`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              )}
            </div>

            {/* Decorative */}
            <div className={`absolute ${index % 2 === 0 ? 'top-0 right-0' : 'top-0 left-0'} w-32 h-32 bg-gradient-to-br ${typeColors[entry.type]} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />
            <div className={`absolute bottom-4 ${index % 2 === 0 ? 'md:left-4 right-4' : 'md:right-4 right-4'} text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors`}>
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Modal rendered via portal */}
      {hasDetails && (
        <DetailsModal
          entry={entry}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onOpenLightbox={onOpenLightbox}
        />
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   Details Modal — rendered in body via portal
   This fixes the overflow/clipping issue completely
───────────────────────────────────────────────────── */
function DetailsModal({ entry, isOpen, onClose, onOpenLightbox }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]  = useState(false);
  const hasPhotos = (entry.eventPhotos?.length ?? 0) > 0;

  // Auto-advance photos
  useEffect(() => {
    if (!isOpen || !hasPhotos) return;
    setPhotoIdx(0);
    setImgLoaded(false);
    setImgError(false);
    const iv = setInterval(() => setPhotoIdx(p => (p + 1) % entry.eventPhotos.length), 3500);
    return () => clearInterval(iv);
  }, [isOpen, hasPhotos, entry.eventPhotos]);

  // Reset on photo change
  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [photoIdx]);

  // Lock scroll + ESC — split into two separate effects
  useEffect(() => {
    if (!isOpen) return;
    // Save scroll pos and lock body
    const y = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${y}px`;
    document.body.style.width    = '100%';
    return () => {
      // Read back the stored value — don't rely on closure variable
      const stored = Math.abs(parseInt(document.body.style.top || '0', 10));
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
      window.scrollTo(0, stored);
    };
  }, [isOpen]); // ← only isOpen, never re-runs during the open phase

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="timeline-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1,   y: 0  }}
          exit  ={{ opacity: 0, scale: 0.9,  y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-700/80 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Gradient top bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${typeColors[entry.type]}`} />

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
            <div>
              <div className="text-white font-bold text-base">{entry.company}</div>
              <div className="text-gray-500 text-xs mt-0.5">{entry.title} · {entry.period}</div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-red-500/80 border border-zinc-700 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 px-5 pb-5 space-y-4">

            {/* ── Photos gallery ── */}
            {hasPhotos && (
              <div className="rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
                {/* Main photo */}
                <div
                  className="relative h-52 cursor-pointer group"
                  onClick={() => onOpenLightbox(entry.eventPhotos, photoIdx)}
                >
                  {/* Spinner while loading */}
                  {!imgLoaded && !imgError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full"
                      />
                    </div>
                  )}
                  {/* Error fallback */}
                  {imgError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800 text-zinc-500 gap-2">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">Image unavailable</span>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={photoIdx}
                      src={entry.eventPhotos[photoIdx]}
                      alt={`${entry.company} photo ${photoIdx + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: imgLoaded ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onLoad={() => setImgLoaded(true)}
                      onError={() => { setImgError(true); setImgLoaded(true); }}
                    />
                  </AnimatePresence>

                  {/* Hover overlay */}
                  {imgLoaded && !imgError && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex flex-col items-center gap-1 text-white">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-xs font-semibold">View Fullscreen</span>
                      </div>
                    </div>
                  )}

                  {/* Counter */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs pointer-events-none">
                    {photoIdx + 1} / {entry.eventPhotos.length}
                  </div>
                </div>

                {/* Dots navigation */}
                <div className="flex gap-1.5 justify-center py-2 px-3 bg-zinc-800/80">
                  {entry.eventPhotos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === photoIdx ? 'bg-cyan-400 w-5' : 'bg-zinc-600 w-1.5 hover:bg-zinc-400'
                      }`}
                      aria-label={`Photo ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Projects ── */}
            {entry.projects.length > 0 && (
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  Projects
                </div>
                <div className="space-y-2">
                  {entry.projects.map(name => (
                    <a
                      key={name}
                      href={`https://github.com/Nour-ibrahem30/${name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors group"
                    >
                      <svg className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="group-hover:underline">{name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── Live URLs ── */}
            {entry.liveUrls.length > 0 && (
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Live Websites
                </div>
                <div className="space-y-2">
                  {entry.liveUrls.map((site, i) => (
                    <a
                      key={i}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors group"
                    >
                      <svg className="w-4 h-4 flex-shrink-0 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>{site.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── Videos ── */}
            {(entry.eventVideos?.length ?? 0) > 0 && (
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  Videos
                </div>
                <div className="space-y-3">
                  {entry.eventVideos.map((url, i) => (
                    <div key={i} className="rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700">
                      <CustomVideoPlayer src={url} className="w-full max-h-44" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WordPress indicator */}
            {entry.stats?.wordpressSites && (
              <div className="flex items-center gap-2 text-sm py-2 border-t border-zinc-800">
                <span className="text-cyan-400 font-semibold">{entry.stats.wordpressSites} WordPress Websites</span>
                <span className="text-gray-500">built</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
