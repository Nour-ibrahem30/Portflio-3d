import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { timelineConfig, typeColors } from '../config/timelineConfig';
import { getProjectTimeline } from '../config/timelineConfig';
import ImageLightbox from './ImageLightbox';

export default function TimelineSectionEnhanced() {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleEntryInteraction = (entry) => {
    if (isMobile) {
      setSelectedEntry(selectedEntry?.id === entry.id ? null : entry);
    }
  };

  const openLightbox = (images, index = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="experience" className="relative min-h-screen py-32 px-6 md:px-12 bg-black w-full">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none -z-10">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-96 h-96 bg-green-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], rotate: [0, -90, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
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
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-4">
            <div>MY</div>
            <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              JOURNEY
            </div>
          </h2>
          <p className="text-gray-500 text-lg uppercase tracking-wider">
            Experience & Projects Timeline
          </p>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '200px' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-4"
          />
        </motion.div>

        <div className="relative overflow-visible">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-lg shadow-purple-500/50" />

          {/* Timeline items */}
          <div className="space-y-16 overflow-visible">
            {timelineConfig.map((entry, index) => (
              <TimelineEntry
                key={entry.id}
                entry={entry}
                index={index}
                isSelected={selectedEntry?.id === entry.id}
                onInteraction={handleEntryInteraction}
                isMobile={isMobile}
                onOpenLightbox={openLightbox}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={lightboxIndex}
      />
    </section>
  );
}

// Timeline Entry Component
function TimelineEntry({ entry, index, isSelected, onInteraction, isMobile, onOpenLightbox }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = (e) => {
    e.stopPropagation();
    setIsPopupOpen(!isPopupOpen);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center overflow-visible ${
        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Year badge */}
      <motion.div
        whileHover={{ scale: 1.3 }}
        transition={{ duration: 0.3 }}
        className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 z-20"
      >
        <div className={`w-6 h-6 bg-gradient-to-br ${typeColors[entry.type]} rounded-full shadow-lg border-4 border-black`} />
      </motion.div>

      {/* Content */}
      <div className={`w-full md:w-5/12 ml-20 md:ml-0 ${
        index % 2 === 0 ? 'md:pr-20 md:text-right' : 'md:pl-20'
      }`}>
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          transition={{ duration: 0.3 }}
          className="relative group cursor-pointer overflow-visible"
          onClick={togglePopup}
        >
          {/* Card */}
          <div className="relative bg-zinc-900/90 backdrop-blur-sm p-8 rounded-2xl border border-zinc-700 hover:border-purple-500/50 overflow-hidden transition-all duration-300 shadow-xl">
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[entry.type]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Year + Type badge */}
              <div className={`flex items-center gap-3 mb-4 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${typeColors[entry.type]} text-white shadow-lg`}>
                  {entry.type}
                </div>
                <div className="text-gray-600 font-bold">
                  {entry.year}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                {entry.title}
              </h3>
              
              <p className="text-purple-400 mb-1 font-semibold">
                {entry.company}
              </p>
              
              <p className="text-gray-600 text-sm mb-4">
                📍 {entry.location} • 📅 {entry.period}
              </p>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                {entry.description}
              </p>

              {/* Stats */}
              {entry.stats && (
                <div className={`flex flex-wrap gap-4 mb-6 ${
                  index % 2 === 0 ? 'md:justify-end' : ''
                }`}>
                  {Object.entries(entry.stats).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className="text-purple-400 font-bold">{value}</span>
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Skills */}
              <div className={`flex flex-wrap gap-2 ${
                index % 2 === 0 ? 'md:justify-end' : ''
              }`}>
                {entry.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-xs font-medium border border-gray-700 hover:border-purple-500 transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              {/* Projects indicator */}
              {(entry.projects.length > 0 || entry.eventPhotos?.length > 0 || entry.eventVideos?.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 pt-6 border-t border-zinc-700"
                >
                  <div className={`flex flex-wrap items-center gap-4 text-sm ${
                    index % 2 === 0 ? 'md:justify-end' : ''
                  }`}>
                    {/* View Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        isPopupOpen 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-purple-500/20 text-purple-400'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isPopupOpen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                      <span>{isPopupOpen ? 'Click to Close' : 'Click to View'}</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Decorative corner */}
            <div className={`absolute ${index % 2 === 0 ? 'top-0 right-0' : 'top-0 left-0'} w-32 h-32 bg-gradient-to-br ${typeColors[entry.type]} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity duration-500`}></div>
            
            {/* Number */}
            <div className={`absolute bottom-4 ${index % 2 === 0 ? 'md:left-4 right-4' : 'md:right-4 right-4'} text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors`}>
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>

          {/* Connecting line */}
          <div className={`absolute top-1/2 transform -translate-y-1/2 ${
            index % 2 === 0 ? 'md:-right-20 -left-12' : 'md:-left-20 -left-12'
          } w-12 md:w-20 h-px bg-gradient-to-r ${typeColors[entry.type]} opacity-30`}></div>

          {/* Projects Popup */}
          {(entry.projects.length > 0 || entry.liveUrls.length > 0 || entry.eventPhotos?.length > 0 || entry.eventVideos?.length > 0) && (
            <ProjectsPopup
              entry={entry}
              position={index % 2 === 0 ? 'right' : 'left'}
              onOpenLightbox={onOpenLightbox}
              isVisible={isPopupOpen}
              onClose={closePopup}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Projects Popup Component
function ProjectsPopup({ entry, position, onOpenLightbox, isVisible, onClose }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const hasPhotos = entry.eventPhotos && entry.eventPhotos.length > 0;

  useEffect(() => {
    if (!hasPhotos) return;
    
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % entry.eventPhotos.length);
    }, 3000); // Change photo every 3 seconds

    return () => clearInterval(interval);
  }, [hasPhotos, entry.eventPhotos]);

  if (!isVisible) return null;

  return (
    <div
      className={`absolute top-full mt-4 ${
        position === 'right' ? 'md:right-0' : 'md:left-0'
      } left-0 w-full md:w-96 z-[9999] animate-in fade-in slide-in-from-top-2 duration-300`}
      style={{ 
        position: 'absolute', 
        maxWidth: 'min(24rem, calc(100vw - 3rem))'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-zinc-900 border border-purple-500/50 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl relative z-[9999] w-full">
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-3 z-[10000] w-8 h-8 flex items-center justify-center bg-black/70 hover:bg-red-500 rounded-full transition-colors group"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Event Photos Gallery */}
        {hasPhotos && (
          <div 
            className="relative h-48 bg-zinc-800 overflow-hidden group cursor-pointer"
            onClick={() => onOpenLightbox(entry.eventPhotos, currentPhotoIndex)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                src={entry.eventPhotos[currentPhotoIndex]}
                alt={`${entry.company} - Photo ${currentPhotoIndex + 1}`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover pointer-events-none cursor-pointer"
                role="button"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </AnimatePresence>
            
            {/* Click to view overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </motion.div>
                <p className="text-white font-semibold text-sm">Click to view full size</p>
                <p className="text-white/70 text-xs mt-1">{entry.eventPhotos.length} photos</p>
              </div>
            </motion.div>
            
            {/* Photo counter */}
            <div className="absolute bottom-2 right-2 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white pointer-events-none">
              {currentPhotoIndex + 1} / {entry.eventPhotos.length}
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-2 left-2 flex gap-1">
              {entry.eventPhotos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPhotoIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentPhotoIndex 
                      ? 'bg-purple-400 w-4' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        <div className="p-6">
          {/* Projects */}
          {entry.projects.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                Projects ({entry.projects.length})
              </h4>
              <div className="space-y-2">
                {entry.projects.map((projectName) => (
                  <motion.div
                    key={projectName}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{projectName}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Live URLs */}
          {entry.liveUrls.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Live Websites
              </h4>
              <div className="space-y-2">
                {entry.liveUrls.map((site, idx) => (
                  <motion.a
                    key={idx}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors group"
                  >
                    <svg className="w-4 h-4 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>{site.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Event Videos */}
          {entry.eventVideos?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                Event Videos ({entry.eventVideos.length})
              </h4>
              <div className="space-y-3 w-full">
                {entry.eventVideos.map((videoUrl, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden bg-zinc-800 w-full cursor-pointer"
                    onClick={(e) => {
                      const video = e.currentTarget.querySelector('video');
                      if (video) {
                        if (video.paused) {
                          video.play();
                        } else {
                          video.pause();
                        }
                      }
                    }}
                  >
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-auto max-h-48"
                      preload="metadata"
                      style={{ width: '100%', height: 'auto', maxHeight: '12rem', objectFit: 'contain' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.target.paused) {
                          e.target.play();
                        } else {
                          e.target.pause();
                        }
                      }}
                      onError={(e) => {
                        console.error('Video failed to load:', videoUrl);
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white pointer-events-none">
                      Video {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WordPress Sites indicator for Value Marketing */}
          {entry.stats?.wordpressSites && (
            <div className="mt-4 pt-4 border-t border-zinc-700">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                <span className="text-purple-400 font-semibold">{entry.stats.wordpressSites} WordPress Websites</span>
              </div>
            </div>
          )}
        </div>

        {/* Arrow pointer */}
        <div className={`absolute -top-2 ${
          position === 'right' ? 'md:right-8 left-8' : 'md:left-8 left-8'
        } w-4 h-4 bg-zinc-900 border-t border-l border-purple-500/50 transform rotate-45`}></div>
      </div>
    </div>
  );
}
