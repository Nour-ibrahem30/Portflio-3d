import { useEffect, useState, useRef } from 'react';

const CODE_LINES = [
  { text: 'import React from "react";',         color: '#94a3b8' },
  { text: 'import { motion } from "framer";',   color: '#94a3b8' },
  { text: '',                                    color: '' },
  { text: 'const Portfolio = () => {',           color: '#7dd3fc' },
  { text: '  const dev = "Nour Ibrahem";',       color: '#86efac' },
  { text: '  const role = "Front-End Dev";',     color: '#86efac' },
  { text: '  const ready = true; ✓',            color: '#34d399' },
  { text: '  return <App />;',                   color: '#c084fc' },
  { text: '};',                                  color: '#7dd3fc' },
];

export default function PageLoader({ onLoadComplete }) {
  const [progress,     setProgress]     = useState(0);
  const [codeLines,    setCodeLines]    = useState([]);
  const [isComplete,   setIsComplete]   = useState(false);
  const [fadeOut,      setFadeOut]      = useState(false);
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  /* ── Particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 55 }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 1.5 + 0.4,
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   (Math.random() - 0.5) * 0.4,
      o:    Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,184,${p.o})`;
        ctx.fill();
      });
      // draw faint connections
      particles.forEach((a, i) => {
        particles.slice(i + 1, i + 5).forEach(b => {
          const dx = a.x - b.x, dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - d / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        });
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  /* ── Code lines typing (staggered) ── */
  useEffect(() => {
    CODE_LINES.forEach((line, i) => {
      setTimeout(() => {
        setCodeLines(prev => [...prev, line]);
      }, 120 * i);
    });
  }, []);

  /* ── Progress bar ── */
  useEffect(() => {
    const start = Date.now();
    const MIN   = 2200;

    const iv = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + Math.random() * 14 + 2, 97);
        if (next >= 97) {
          clearInterval(iv);
          const wait = Math.max(0, MIN - (Date.now() - start));
          setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
              setFadeOut(true);
              setTimeout(() => {
                setIsComplete(true);
                onLoadComplete?.();
              }, 600);
            }, 400);
          }, wait);
        }
        return next;
      });
    }, 90);

    return () => clearInterval(iv);
  }, [onLoadComplete]);

  if (isComplete) return null;

  const stage =
    progress < 25 ? 'Initializing...'  :
    progress < 50 ? 'Loading Assets...' :
    progress < 75 ? 'Building UI...'    :
    progress < 99 ? 'Almost Ready...'   : 'Welcome! 🚀';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#050508',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
        overflow: 'hidden',
      }}
    >
      {/* particle bg */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* ambient glows */}
      <div style={{
        position: 'absolute', top: '15%', left: '20%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '15%',
        width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
      }} />

      {/* main card */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        width: '100%', maxWidth: 460, padding: '0 24px',
        animation: 'loaderFadeIn 0.5s ease-out forwards',
      }}>

        {/* Logo */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          marginBottom: '2.5rem',
          animation: 'logoIn 0.7s cubic-bezier(.34,1.56,.64,1) forwards',
        }}>
          {/* hexagon-ish avatar */}
          <div style={{
            width: 88, height: 88,
            background: 'linear-gradient(135deg,#6366f1,#22d3ee)',
            borderRadius: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(99,102,241,0.35)',
            marginBottom: '1rem',
            position: 'relative',
          }}>
            <span style={{
              fontSize: '2.4rem', fontWeight: 900, color: '#fff',
              fontFamily: 'monospace', letterSpacing: '-2px',
            }}>NI</span>
            {/* ring */}
            <div style={{
              position: 'absolute', inset: -6,
              borderRadius: '36px',
              border: '1.5px solid rgba(99,102,241,0.3)',
              animation: 'ringPulse 2s ease-in-out infinite',
            }} />
          </div>
          <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Nour Ibrahem
          </div>
          <div style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 4 }}>
            Front-End Developer
          </div>
        </div>

        {/* Code terminal */}
        <div style={{
          width: '100%',
          background: 'rgba(15,15,20,0.85)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 16,
          padding: '16px 20px',
          marginBottom: '2rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
          minHeight: 170,
        }}>
          {/* terminal header dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {['#ef4444','#f59e0b','#22c55e'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
            <span style={{ color: '#334155', fontSize: 11, marginLeft: 8, fontFamily: 'monospace' }}>
              portfolio.jsx
            </span>
          </div>

          {/* lines */}
          <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.9 }}>
            {codeLines.map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.color || 'transparent',
                  display: 'flex', alignItems: 'center', gap: 10,
                  animation: 'lineIn 0.25s ease-out forwards',
                  opacity: 0,
                }}
              >
                <span style={{ color: '#1e3a5f', minWidth: 18, textAlign: 'right', fontSize: 10 }}>{i + 1}</span>
                <span>{line.text}</span>
              </div>
            ))}
            {/* blinking cursor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#1e3a5f', minWidth: 18, textAlign: 'right', fontSize: 10 }}>{codeLines.length + 1}</span>
              <span style={{
                display: 'inline-block', width: 7, height: 14,
                background: '#6366f1', borderRadius: 2,
                animation: 'blink 1s step-end infinite',
              }} />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%' }}>
          <div style={{
            height: 4, background: 'rgba(255,255,255,0.06)',
            borderRadius: 99, overflow: 'hidden', marginBottom: 12,
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg,#6366f1,#22d3ee)',
              borderRadius: 99,
              transition: 'width 0.35s ease-out',
              position: 'relative',
              boxShadow: '0 0 10px rgba(99,102,241,0.6)',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)',
                animation: 'shimmer 1.4s linear infinite',
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              color: '#64748b', fontSize: 11, letterSpacing: '0.1em',
              textTransform: 'uppercase', fontFamily: 'monospace',
              animation: 'fadeIn 0.3s ease',
            }} key={stage}>{stage}</span>
            <span style={{
              color: '#6366f1', fontSize: 12, fontWeight: 700,
              fontFamily: 'monospace', letterSpacing: '0.05em',
              textShadow: '0 0 8px rgba(99,102,241,0.5)',
            }}>
              {Math.floor(progress)}%
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loaderFadeIn {
          from { opacity:0; transform: translateY(20px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes logoIn {
          from { opacity:0; transform: scale(0.7) rotate(-8deg); }
          to   { opacity:1; transform: scale(1) rotate(0deg); }
        }
        @keyframes ringPulse {
          0%,100% { opacity:0.3; transform:scale(1); }
          50%      { opacity:0.7; transform:scale(1.06); }
        }
        @keyframes lineIn {
          from { opacity:0; transform:translateX(-8px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes blink {
          0%,100% { opacity:1; }
          50%      { opacity:0; }
        }
        @keyframes shimmer {
          from { transform:translateX(-100%); }
          to   { transform:translateX(200%); }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
      `}</style>
    </div>
  );
}
