/**
 * Performance Optimization Utilities
 */

// Debounce function
export const debounce = (func, wait = 100) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Request Animation Frame throttle
export const rafThrottle = (func) => {
  let rafId = null;
  return function executedFunction(...args) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });
    }
  };
};

// Passive event listener support check
export const supportsPassive = () => {
  let passiveSupported = false;
  try {
    const options = {
      get passive() {
        passiveSupported = true;
        return false;
      }
    };
    window.addEventListener('test', null, options);
    window.removeEventListener('test', null, options);
  } catch (err) {
    passiveSupported = false;
  }
  return passiveSupported;
};

// Get passive event options
export const getPassiveOptions = () => {
  return supportsPassive() ? { passive: true } : false;
};

// Reduce motion check
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Connection speed check
export const getConnectionSpeed = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return 'unknown';
  
  const effectiveType = connection.effectiveType;
  return effectiveType; // '4g', '3g', '2g', 'slow-2g'
};

// Check if on slow connection
export const isSlowConnection = () => {
  const speed = getConnectionSpeed();
  return speed === '2g' || speed === 'slow-2g';
};

// Defer execution until idle
export const runWhenIdle = (callback, options = {}) => {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, options);
  }
  // Fallback for browsers without requestIdleCallback
  return setTimeout(callback, 1);
};

// Cancel idle callback
export const cancelIdle = (id) => {
  if ('cancelIdleCallback' in window) {
    cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

// Preload resource
export const preloadResource = (href, as = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  document.head.appendChild(link);
};

// Prefetch resource
export const prefetchResource = (href) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};
