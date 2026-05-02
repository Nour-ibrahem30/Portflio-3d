import { useEffect } from 'react';

/**
 * Hook to track Core Web Vitals
 * Measures: LCP, FID, CLS, FCP, TTFB
 * Sends data to Google Analytics
 */
const usePerformance = () => {
  useEffect(() => {
    // Check if Performance API is available
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    // Function to send metrics to analytics
    const sendToAnalytics = (metric) => {
      // Send to Google Analytics if available
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_value: metric.value,
          metric_delta: metric.delta,
        });
      }

      // Log to console in development
      if (import.meta.env.DEV) {
        console.log(`[Performance] ${metric.name}:`, Math.round(metric.value), 'ms');
      }
    };

    // Measure First Contentful Paint (FCP)
    const measureFCP = () => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        sendToAnalytics({
          name: 'FCP',
          value: fcpEntry.startTime,
          id: 'fcp-' + Date.now(),
          delta: fcpEntry.startTime,
        });
      }
    };

    // Measure Largest Contentful Paint (LCP)
    const measureLCP = () => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            sendToAnalytics({
              name: 'LCP',
              value: lastEntry.renderTime || lastEntry.loadTime,
              id: 'lcp-' + Date.now(),
              delta: lastEntry.renderTime || lastEntry.loadTime,
            });
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP measurement failed:', e);
        }
      }
    };

    // Measure First Input Delay (FID)
    const measureFID = () => {
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              sendToAnalytics({
                name: 'FID',
                value: entry.processingStart - entry.startTime,
                id: 'fid-' + Date.now(),
                delta: entry.processingStart - entry.startTime,
              });
            });
          });
          
          observer.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID measurement failed:', e);
        }
      }
    };

    // Measure Cumulative Layout Shift (CLS)
    const measureCLS = () => {
      if ('PerformanceObserver' in window) {
        try {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            
            sendToAnalytics({
              name: 'CLS',
              value: clsValue,
              id: 'cls-' + Date.now(),
              delta: clsValue,
            });
          });
          
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS measurement failed:', e);
        }
      }
    };

    // Measure Time to First Byte (TTFB)
    const measureTTFB = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        
        sendToAnalytics({
          name: 'TTFB',
          value: ttfb,
          id: 'ttfb-' + Date.now(),
          delta: ttfb,
        });
      }
    };

    // Run measurements
    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();
    measureTTFB();

    // Cleanup function
    return () => {
      // Performance observers are automatically cleaned up
    };
  }, []);
};

export default usePerformance;
