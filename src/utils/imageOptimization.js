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

// Preload critical images with timeout
export const preloadImage = (src, timeout = 5000) => {
  return Promise.race([
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Image load timeout: ${src}`)), timeout)
    )
  ]);
};

// Generate placeholder for images
export const getImagePlaceholder = (width = 400, height = 300) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%2318181b' width='${width}' height='${height}'/%3E%3C/svg%3E`;
};

// Generate error placeholder
export const getImageErrorPlaceholder = () => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23222' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' dominant-baseline='middle' fill='%23666' font-size='16'%3EImage failed to load%3C/text%3E%3C/svg%3E`;
};

// Optimize image URL (add quality parameters if needed)
export const optimizeImageUrl = (src) => {
  if (!src) return '';
  // إذا كانت صورة محلية، اتركها كما هي
  if (src.startsWith('/')) return src;
  // إذا كانت من CDN، يمكن إضافة معاملات التحسين
  return src;
};

// Cleanup observer
export const cleanupImageObserver = () => {
  if (imageObserver) {
    imageObserver.disconnect();
    imageObserver = null;
  }
};
