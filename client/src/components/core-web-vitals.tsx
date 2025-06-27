import { useEffect } from 'react';

// Core Web Vitals measurement and optimization
export function CoreWebVitals() {
  useEffect(() => {
    // Dynamic import of web-vitals to avoid blocking
    import('web-vitals').then((webVitals) => {
      if (webVitals.onCLS) {
        webVitals.onCLS((metric: any) => {
          console.log('CLS:', metric.value);
        });
      }
      if (webVitals.onLCP) {
        webVitals.onLCP((metric: any) => {
          console.log('LCP:', metric.value);
        });
      }
      if (webVitals.onFID) {
        webVitals.onFID((metric: any) => {
          console.log('FID:', metric.value);
        });
      }
      if (webVitals.onFCP) {
        webVitals.onFCP((metric: any) => {
          console.log('FCP:', metric.value);
        });
      }
      if (webVitals.onTTFB) {
        webVitals.onTTFB((metric: any) => {
          console.log('TTFB:', metric.value);
        });
      }
    }).catch(() => {
      console.log('Web Vitals library not available, using fallback');
    });
  }, []);

  return null; // This component doesn't render anything
}

// Fallback performance measurement
function measurePerformance() {
  if (typeof window === 'undefined') return;

  // Measure First Contentful Paint
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log('FCP:', entry.startTime);
      }
    }
  });
  observer.observe({ entryTypes: ['paint'] });

  // Measure Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // Measure Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    console.log('CLS:', clsValue);
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });
}

// Performance optimization utilities
export const PerformanceOptimizations = {
  // Preload critical resources
  preloadCriticalResources: () => {
    const criticalResources = [
      { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
      { href: '/fonts/montserrat.woff2', as: 'font', type: 'font/woff2' },
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  },

  // Optimize images for LCP
  optimizeImages: () => {
    const images = document.querySelectorAll('img[data-priority="high"]');
    images.forEach(img => {
      if (img instanceof HTMLImageElement) {
        img.loading = 'eager';
        img.fetchPriority = 'high';
      }
    });
  },

  // Minimize layout shifts
  reserveImageSpace: () => {
    const style = document.createElement('style');
    style.textContent = `
      .aspect-ratio-container {
        position: relative;
        width: 100%;
      }
      .aspect-ratio-container::before {
        content: '';
        display: block;
        padding-top: var(--aspect-ratio, 56.25%);
      }
      .aspect-ratio-container > * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `;
    document.head.appendChild(style);
  },

  // Optimize critical rendering path
  optimizeCriticalPath: () => {
    // Inline critical CSS for above-the-fold content
    const criticalCSS = `
      .hero-section { min-height: 100vh; }
      .font-montserrat { font-family: 'Montserrat', sans-serif; }
      .text-navy { color: #1e3a8a; }
      .text-talencor-gold { color: #f59e0b; }
      .bg-navy { background-color: #1e3a8a; }
      .bg-talencor-gold { background-color: #f59e0b; }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  },

  // Improve First Input Delay
  optimizeFID: () => {
    // Use requestIdleCallback for non-critical tasks
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Initialize non-critical features
        console.log('Initializing non-critical features during idle time');
      });
    }

    // Debounce scroll events
    let scrollTimer: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        // Handle scroll events
      }, 16); // ~60fps
    }, { passive: true });
  }
};

// Initialize performance optimizations
export function initializePerformanceOptimizations() {
  if (typeof window === 'undefined') return;

  // Run optimizations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      PerformanceOptimizations.preloadCriticalResources();
      PerformanceOptimizations.optimizeImages();
      PerformanceOptimizations.reserveImageSpace();
      PerformanceOptimizations.optimizeCriticalPath();
      PerformanceOptimizations.optimizeFID();
    });
  } else {
    PerformanceOptimizations.preloadCriticalResources();
    PerformanceOptimizations.optimizeImages();
    PerformanceOptimizations.reserveImageSpace();
    PerformanceOptimizations.optimizeCriticalPath();
    PerformanceOptimizations.optimizeFID();
  }
}