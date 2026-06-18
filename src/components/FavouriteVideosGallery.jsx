import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const videos = [
  { id: 1, src: '/My_Favourite_Videos/1.mp4' },
  { id: 2, src: '/My_Favourite_Videos/2.mp4' },
  { id: 3, src: '/My_Favourite_Videos/3.mp4' },
  { id: 4, src: '/My_Favourite_Videos/4.mp4' },
  { id: 5, src: '/My_Favourite_Videos/5.mp4' },
  { id: 6, src: '/My_Favourite_Videos/6.mp4' },
];

export default function FavouriteVideosGallery() {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [buffering, setBuffering] = useState({});
  const [isInView, setIsInView] = useState(false);
  const videoRefs = useRef({});
  const sectionRef = useRef(null);

  // Lazy load videos when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Stop observing after first view
          }
        });
      },
      { rootMargin: '200px' } // Start loading 200px before section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlayVideo = (videoId) => {
    // Stop other videos
    Object.keys(videoRefs.current).forEach(id => {
      if (id !== videoId.toString() && videoRefs.current[id]) {
        videoRefs.current[id].pause();
      }
    });
    
    setPlayingVideo(videoId);
    
    // Start playing immediately
    setTimeout(() => {
      const videoElement = videoRefs.current[videoId];
      if (videoElement) {
        videoElement.play().catch(err => {
          console.log('Play error:', err);
        });
      }
    }, 50);
  };

  const handleVideoLoaded = (e, videoId) => {
    if (e.target.readyState >= 2) { // HAVE_CURRENT_DATA - can start playing
      setLoadingVideo(null);
      setBuffering(prev => ({ ...prev, [videoId]: false }));
    }
  };

  const handleWaiting = (videoId) => {
    setBuffering(prev => ({ ...prev, [videoId]: true }));
  };

  const handlePlaying = (videoId) => {
    setLoadingVideo(null);
    setBuffering(prev => ({ ...prev, [videoId]: false }));
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Background blobs — hidden on mobile for perf */}
      <div className="hidden md:block absolute inset-0 opacity-20 -z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-96 h-96 bg-slate-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-700/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-4">
            <div>GUIDING</div>
            <div className="bg-gradient-to-r from-slate-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              MOMENTS
            </div>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            A curated selection of lectures and teachings from respected scholars, offering wisdom, reflection, and support during challenging times.
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '200px' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-blue-900 via-slate-700 to-cyan-800 rounded-full mt-4 mx-auto"
          />
        </motion.div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800 hover:border-slate-600/50 transition-all duration-300 shadow-xl"
            >
              {/* Video Container */}
              <div className="relative h-64 overflow-hidden bg-zinc-800">
                {playingVideo === video.id ? (
                  // Playing Video
                  <>
                    {(loadingVideo === video.id || buffering[video.id]) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/95 z-10">
                        <div className="flex flex-col items-center gap-4">
                          <motion.div
                            className="w-16 h-16 border-4 border-slate-600 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <p className="text-gray-400 text-sm">
                            {loadingVideo === video.id ? 'Loading video...' : 'Buffering...'}
                          </p>
                        </div>
                      </div>
                    )}
                    <video
                      ref={(el) => (videoRefs.current[video.id] = el)}
                      className="w-full h-full object-cover bg-black"
                      controls
                      playsInline
                      preload={isInView ? "auto" : "none"}
                      muted={false}
                      onLoadStart={() => setLoadingVideo(video.id)}
                      onLoadedData={(e) => handleVideoLoaded(e, video.id)}
                      onCanPlay={(e) => {
                        handleVideoLoaded(e, video.id);
                        // Auto play when ready
                        if (playingVideo === video.id) {
                          e.target.play().catch(() => {});
                        }
                      }}
                      onWaiting={() => handleWaiting(video.id)}
                      onPlaying={() => handlePlaying(video.id)}
                      onEnded={() => {
                        setPlayingVideo(null);
                        setLoadingVideo(null);
                        setBuffering(prev => ({ ...prev, [video.id]: false }));
                      }}
                    >
                      <source src={video.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </>
                ) : (
                  // Thumbnail with Play Button
                  <>
                    <video
                      src={video.src}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      preload={isInView ? "metadata" : "none"}
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Play Button */}
                    <motion.button
                      onClick={() => handlePlayVideo(video.id)}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      animate={{
                        scale: hoveredIndex === index ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      aria-label={`Play video ${video.id}`}
                    >
                      <div className="w-20 h-20 rounded-full bg-slate-600/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                        <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </motion.button>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-400 text-sm">
                  {loadingVideo === video.id 
                    ? 'Loading...' 
                    : buffering[video.id]
                      ? 'Buffering...'
                      : playingVideo === video.id 
                        ? 'Now playing...' 
                        : 'Click to watch'}
                </p>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-600/20 to-cyan-700/20 blur-xl"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}








