/**
 * Image Optimization Utilities
 * Lazy loading and performance optimization for images
 */

// Intersection Observer for lazy loading
let imageObserver;

export const initImageObserver = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  if (imageObserver) {
    return imageObserver;
  }

  imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '50px 0px', // Start loading 50px before entering viewport
      threshold: 0.01
    }
  );

  return imageObserver;
};

// Lazy load image
export const lazyLoadImage = (imgElement) => {
  const observer = initImageObserver();
  if (observer && imgElement) {
    observer.observe(imgElement);
  }
};

// Preload critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Generate placeholder for images
export const getImagePlaceholder = (width = 400, height = 300) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%2318181b' width='${width}' height='${height}'/%3E%3C/svg%3E`;
};

// Cleanup observer
export const cleanupImageObserver = () => {
  if (imageObserver) {
    imageObserver.disconnect();
    imageObserver = null;
  }
};
