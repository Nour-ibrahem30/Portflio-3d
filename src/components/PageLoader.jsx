import { useEffect, useState } from 'react';

export default function PageLoader({ onLoadComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
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
    const startTime = Date.now();
    const minLoadingTime = 2500; // Minimum 2.5 seconds

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
          
          // Ensure minimum loading time
          const elapsed = Date.now() - startTime;
          const remainingTime = Math.max(0, minLoadingTime - elapsed);
          
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => onLoadComplete?.(), 800);
          }, remainingTime);
          
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  if (isComplete) return null;

  return (
    <div 
      className="page-loader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: isComplete ? 0 : 1,
        transition: 'opacity 0.6s ease-out'
      }}
    >
      {/* Animated Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div 
          className="bg-circle-1"
          style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '384px',
            height: '384px',
            background: 'rgba(26, 41, 128, 0.1)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'float1 20s linear infinite'
          }}
        />
        <div 
          className="bg-circle-2"
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '25%',
            width: '384px',
            height: '384px',
            background: 'rgba(38, 208, 206, 0.1)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'float2 15s linear infinite'
          }}
        />
      </div>

      <div style={{ position: 'relative', textAlign: 'center', zIndex: 10 }}>
        {/* Logo Animation */}
        <div 
          className="logo-container"
          style={{
            marginBottom: '2rem',
            animation: 'logoAppear 0.8s ease-out forwards'
          }}
        >
          <h1 
            style={{
              fontSize: '6rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s linear infinite',
              margin: 0,
              padding: 0,
              lineHeight: 1
            }}
          >
            NI
          </h1>
          <p 
            style={{
              color: '#6b7280',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginTop: '0.5rem',
              animation: 'fadeInUp 0.5s ease-out 0.5s forwards',
              opacity: 0
            }}
          >
            Nour Ibrahem
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '320px', margin: '0 auto' }}>
          <div 
            style={{
              position: 'relative',
              height: '8px',
              background: '#18181b',
              borderRadius: '9999px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)',
                width: `${progress}%`,
                transition: 'width 0.3s ease-out',
                position: 'relative'
              }}
            >
              {/* Shine effect */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shine 1.5s linear infinite'
                }}
              />
            </div>
          </div>

          {/* Progress Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p 
              key={loadingText}
              style={{
                color: '#9ca3af',
                fontSize: '0.875rem',
                margin: 0,
                animation: 'fadeIn 0.3s ease-out'
              }}
            >
              {loadingText}
            </p>
            <p 
              style={{
                color: '#3b82f6',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                margin: 0,
                transform: progress === 100 ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.3s ease-out'
              }}
            >
              {Math.floor(progress)}%
            </p>
          </div>
        </div>

        {/* Loading Dots */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '2rem',
            animation: 'fadeIn 0.5s ease-out 0.8s forwards',
            opacity: 0
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                background: '#3b82f6',
                borderRadius: '50%',
                animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes logoAppear {
          from {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shine {
          from { transform: translateX(-100%); }
          to { transform: translateX(200%); }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        @keyframes float1 {
          0% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.2) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
          }
        }

        @keyframes float2 {
          0% {
            transform: scale(1.2) rotate(360deg);
          }
          50% {
            transform: scale(1) rotate(180deg);
          }
          100% {
            transform: scale(1.2) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}










