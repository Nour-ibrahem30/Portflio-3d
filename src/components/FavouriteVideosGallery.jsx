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
  const videoRefs = useRef({});

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
    <section className="relative min-h-screen py-32 px-6 md:px-12 bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
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
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-4">
            <div>GUIDING</div>
            <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
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
            className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mt-4 mx-auto"
          />
        </motion.div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 shadow-xl"
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
                            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
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
                      preload="auto"
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
                      preload="metadata"
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
                    >
                      <div className="w-20 h-20 rounded-full bg-purple-500/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-purple-500 transition-colors">
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
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
