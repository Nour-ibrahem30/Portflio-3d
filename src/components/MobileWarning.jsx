import { useState, useEffect } from 'react';

export default function MobileWarning() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const wasDismissed = sessionStorage.getItem('mobileWarningDismissed');
    if (wasDismissed) return;

    // Show only on mobile/tablet (< 1024px)
    const checkDevice = () => {
      if (window.innerWidth < 1024) {
        setShow(true);
      }
    };

    checkDevice();
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('mobileWarningDismissed', 'true');
    setDismissed(true);
    setTimeout(() => setShow(false), 400);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9998,
        width: 'calc(100% - 2rem)',
        maxWidth: '420px',
        animation: dismissed ? 'slideDown 0.4s ease-in forwards' : 'slideUp 0.5s ease-out forwards',
      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,15,15,0.97) 0%, rgba(24,24,27,0.97) 100%)',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: '1rem',
        padding: '1rem 1.25rem',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.1)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.875rem',
      }}>
        {/* Icon */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '0.5rem',
          background: 'rgba(59,130,246,0.15)',
          border: '1px solid rgba(59,130,246,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}>
          <svg width="18" height="18" fill="none" stroke="#60a5fa" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            color: '#f1f5f9',
            fontSize: '0.8rem',
            fontWeight: '600',
            margin: '0 0 0.25rem 0',
            letterSpacing: '0.01em',
          }}>
            Best viewed on Desktop
          </p>
          <p style={{
            color: '#94a3b8',
            fontSize: '0.72rem',
            margin: 0,
            lineHeight: '1.5',
          }}>
            This portfolio is optimized for desktop. Some animations may be slower on mobile.
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.375rem',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            marginTop: '2px',
            color: '#64748b',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#64748b';
          }}
          aria-label="Dismiss"
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to   { opacity: 0; transform: translateX(-50%) translateY(20px); }
        }
      `}</style>
    </div>
  );
}
