import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader({ onLoadComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');
  const [isComplete, setIsComplete] = useState(false);

  const loadingStages = [
    { progress: 0, text: 'Initializing...' },
    { progress: 20, text: 'Loading Assets...' },
    { progress: 40, text: 'Building Interface...' },
    { progress: 60, text: 'Applying Styles...' },
    { progress: 80, text: 'Almost Ready...' },
    { progress: 100, text: 'Welcome!' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 10, 100);
        
        // Update loading text based on progress
        const currentStage = loadingStages.find(stage => 
          newProgress >= stage.progress && newProgress < stage.progress + 20
        );
        if (currentStage) {
          setLoadingText(currentStage.text);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setLoadingText('Welcome!');
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => onLoadComplete?.(), 800);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
            />
          </div>

          <div className="relative text-center z-10">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="mb-8"
            >
              <motion.h1 
                className="text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                NI
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-500 text-sm uppercase tracking-widest mt-2"
              >
                Nour Ibrahem
              </motion.p>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-80 mx-auto">
              <div className="relative h-2 bg-zinc-900 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </div>

              {/* Progress Info */}
              <div className="flex justify-between items-center">
                <motion.p
                  key={loadingText}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-400 text-sm"
                >
                  {loadingText}
                </motion.p>
                <motion.p
                  className="text-purple-400 text-sm font-bold"
                  animate={{ scale: progress === 100 ? [1, 1.2, 1] : 1 }}
                >
                  {Math.floor(progress)}%
                </motion.p>
              </div>
            </div>

            {/* Loading Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center gap-2 mt-8"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
