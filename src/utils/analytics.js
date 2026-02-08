// Google Analytics Helper Functions

export const initGA = (measurementId) => {
  if (typeof window === 'undefined') return;
  
  // Load GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize GA
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId);
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('config', 'GA_MEASUREMENT_ID', {
    page_path: url,
  });
};

// Track events
export const trackEvent = (action, category, label, value) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track button clicks
export const trackButtonClick = (buttonName) => {
  trackEvent('click', 'Button', buttonName);
};

// Track section views
export const trackSectionView = (sectionName) => {
  trackEvent('view', 'Section', sectionName);
};

// Track form submissions
export const trackFormSubmit = (formName) => {
  trackEvent('submit', 'Form', formName);
};

// Track external links
export const trackExternalLink = (url) => {
  trackEvent('click', 'External Link', url);
};

// Track downloads
export const trackDownload = (fileName) => {
  trackEvent('download', 'File', fileName);
};

// Usage Example:
// import { initGA, trackButtonClick, trackSectionView } from './utils/analytics';
//
// // In App.jsx useEffect:
// initGA('G-XXXXXXXXXX');
//
// // Track button click:
// <button onClick={() => trackButtonClick('Contact Button')}>Contact</button>
//
// // Track section view:
// useEffect(() => {
//   if (isInView) trackSectionView('Projects Section');
// }, [isInView]);
