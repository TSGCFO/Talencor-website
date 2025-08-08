/**
 * SEO Monitoring & Analytics Module
 * Real-time SEO performance tracking and optimization suggestions
 */

import { SEO_CONFIG } from './seo';

// SEO Performance Metrics
export interface SEOMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  speedIndex: number;
  serverResponseTime: number;
  domContentLoaded: number;
}

// Google Lighthouse Score Simulation
export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

// SEO Health Check
export class SEOMonitor {
  private metrics: SEOMetrics = {
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    timeToInteractive: 0,
    totalBlockingTime: 0,
    speedIndex: 0,
    serverResponseTime: 0,
    domContentLoaded: 0
  };

  // Initialize monitoring
  init() {
    if (typeof window === 'undefined') return;

    // Performance Observer for Core Web Vitals
    this.observePerformance();
    
    // Monitor page visibility changes
    this.monitorVisibility();
    
    // Track user engagement metrics
    this.trackEngagement();
    
    // Monitor JavaScript errors
    this.monitorErrors();
    
    // Track resource loading
    this.trackResources();
  }

  // Observe Core Web Vitals
  private observePerformance() {
    if (!window.PerformanceObserver) return;

    // LCP Observer
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;
      this.sendMetrics('LCP', this.metrics.largestContentfulPaint);
    });

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // Fallback for browsers that don't support this observer
    }

    // FID Observer
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        const firstInput = entries[0] as any;
        this.metrics.firstInputDelay = firstInput.processingStart - firstInput.startTime;
        this.sendMetrics('FID', this.metrics.firstInputDelay);
      }
    });

    try {
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // Fallback
    }

    // CLS Observer
    let clsValue = 0;
    let clsEntries: any[] = [];
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsEntries.push(entry);
          clsValue += (entry as any).value;
        }
      }
      this.metrics.cumulativeLayoutShift = clsValue;
      this.sendMetrics('CLS', this.metrics.cumulativeLayoutShift);
    });

    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Fallback
    }

    // Navigation Timing
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      this.metrics.serverResponseTime = timing.responseEnd - timing.requestStart;
    }

    // First Contentful Paint
    if (window.performance && window.performance.getEntriesByType) {
      const paintEntries = window.performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      });
    }
  }

  // Monitor page visibility for engagement metrics
  private monitorVisibility() {
    let startTime = Date.now();
    let totalTime = 0;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        totalTime += Date.now() - startTime;
        this.sendMetrics('TimeOnPage', totalTime / 1000);
      } else {
        startTime = Date.now();
      }
    });

    // Track before unload
    window.addEventListener('beforeunload', () => {
      totalTime += Date.now() - startTime;
      this.sendMetrics('TotalTimeOnPage', totalTime / 1000);
    });
  }

  // Track user engagement
  private trackEngagement() {
    let scrollDepth = 0;
    let maxScrollDepth = 0;

    // Scroll depth tracking
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      scrollDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
      
      // Send milestone events
      if (scrollDepth >= 25 && scrollDepth < 50) {
        this.sendEvent('ScrollDepth', '25%');
      } else if (scrollDepth >= 50 && scrollDepth < 75) {
        this.sendEvent('ScrollDepth', '50%');
      } else if (scrollDepth >= 75 && scrollDepth < 90) {
        this.sendEvent('ScrollDepth', '75%');
      } else if (scrollDepth >= 90) {
        this.sendEvent('ScrollDepth', '90%');
      }
    });

    // Click tracking
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
          this.sendEvent('OutboundLink', href);
        } else if (href && href.startsWith('#')) {
          this.sendEvent('AnchorLink', href);
        } else {
          this.sendEvent('InternalLink', href || '');
        }
      }
    });
  }

  // Monitor JavaScript errors
  private monitorErrors() {
    window.addEventListener('error', (e) => {
      this.sendError({
        message: e.message,
        source: e.filename,
        line: e.lineno,
        column: e.colno,
        stack: e.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.sendError({
        message: 'Unhandled Promise Rejection',
        reason: e.reason
      });
    });
  }

  // Track resource loading performance
  private trackResources() {
    if (!window.PerformanceObserver) return;

    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resourceEntry = entry as PerformanceResourceTiming;
        if (resourceEntry.duration > 1000) {
          // Log slow resources
          this.sendMetrics('SlowResource', {
            name: resourceEntry.name,
            duration: resourceEntry.duration,
            type: resourceEntry.initiatorType
          });
        }
      }
    });

    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // Fallback
    }
  }

  // Calculate SEO score based on metrics
  calculateSEOScore(): number {
    let score = 100;

    // Core Web Vitals impact
    if (this.metrics.largestContentfulPaint > 2500) score -= 10;
    if (this.metrics.largestContentfulPaint > 4000) score -= 10;
    
    if (this.metrics.firstInputDelay > 100) score -= 10;
    if (this.metrics.firstInputDelay > 300) score -= 10;
    
    if (this.metrics.cumulativeLayoutShift > 0.1) score -= 10;
    if (this.metrics.cumulativeLayoutShift > 0.25) score -= 10;
    
    // Page load time impact
    if (this.metrics.pageLoadTime > 3000) score -= 5;
    if (this.metrics.pageLoadTime > 5000) score -= 10;
    
    // Server response time impact
    if (this.metrics.serverResponseTime > 200) score -= 5;
    if (this.metrics.serverResponseTime > 600) score -= 10;

    return Math.max(0, score);
  }

  // Generate Lighthouse-like scores
  generateLighthouseScores(): LighthouseScores {
    const seoScore = this.calculateSEOScore();
    
    return {
      performance: this.calculatePerformanceScore(),
      accessibility: this.calculateAccessibilityScore(),
      bestPractices: this.calculateBestPracticesScore(),
      seo: seoScore,
      pwa: this.calculatePWAScore()
    };
  }

  private calculatePerformanceScore(): number {
    let score = 100;
    
    // Based on Core Web Vitals and loading metrics
    if (this.metrics.firstContentfulPaint > 1800) score -= 15;
    if (this.metrics.largestContentfulPaint > 2500) score -= 20;
    if (this.metrics.firstInputDelay > 100) score -= 15;
    if (this.metrics.cumulativeLayoutShift > 0.1) score -= 15;
    if (this.metrics.timeToInteractive > 3800) score -= 10;
    if (this.metrics.totalBlockingTime > 200) score -= 10;
    if (this.metrics.speedIndex > 3400) score -= 15;
    
    return Math.max(0, score);
  }

  private calculateAccessibilityScore(): number {
    let score = 100;
    
    // Check for accessibility issues
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
    if (imagesWithoutAlt.length > 0) score -= 20;
    
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) score -= 10;
    
    const forms = document.querySelectorAll('form');
    const formsWithoutLabels = Array.from(forms).filter(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      return Array.from(inputs).some(input => !input.getAttribute('aria-label') && !form.querySelector(`label[for="${input.id}"]`));
    });
    if (formsWithoutLabels.length > 0) score -= 15;
    
    if (!document.documentElement.lang) score -= 10;
    
    const links = document.querySelectorAll('a');
    const linksWithoutText = Array.from(links).filter(link => !link.textContent?.trim());
    if (linksWithoutText.length > 0) score -= 10;
    
    return Math.max(0, score);
  }

  private calculateBestPracticesScore(): number {
    let score = 100;
    
    // HTTPS check
    if (window.location.protocol !== 'https:') score -= 20;
    
    // Console errors check
    const originalError = console.error;
    let errorCount = 0;
    console.error = function() {
      errorCount++;
      originalError.apply(console, arguments as any);
    };
    if (errorCount > 0) score -= 10;
    
    // Image aspect ratio check
    const images = document.querySelectorAll('img');
    const imagesWithoutDimensions = Array.from(images).filter(img => !img.width || !img.height);
    if (imagesWithoutDimensions.length > 0) score -= 10;
    
    // Document title check
    if (!document.title) score -= 10;
    
    // Viewport meta tag check
    if (!document.querySelector('meta[name="viewport"]')) score -= 10;
    
    return Math.max(0, score);
  }

  private calculatePWAScore(): number {
    let score = 0;
    
    // Check for PWA features
    if ('serviceWorker' in navigator) score += 20;
    if (document.querySelector('link[rel="manifest"]')) score += 20;
    if (window.location.protocol === 'https:') score += 20;
    if (document.querySelector('meta[name="theme-color"]')) score += 10;
    if (document.querySelector('meta[name="viewport"]')) score += 10;
    if (document.querySelector('link[rel="icon"]')) score += 10;
    if (document.querySelector('meta[name="apple-mobile-web-app-capable"]')) score += 10;
    
    return Math.min(100, score);
  }

  // Send metrics to analytics
  private sendMetrics(metric: string, value: any) {
    // Integration with Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'seo_metrics', {
        metric_name: metric,
        value: value,
        page_path: window.location.pathname
      });
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`SEO Metric - ${metric}:`, value);
    }
  }

  // Send events to analytics
  private sendEvent(category: string, action: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        page_path: window.location.pathname
      });
    }
  }

  // Send errors to monitoring
  private sendError(error: any) {
    // Integration with error monitoring service
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('SEO Monitor Error:', error);
    }
  }

  // Get current metrics
  getMetrics(): SEOMetrics {
    return this.metrics;
  }

  // Generate SEO report
  generateReport() {
    const scores = this.generateLighthouseScores();
    const metrics = this.getMetrics();
    
    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      scores,
      metrics,
      recommendations: this.generateRecommendations(scores, metrics)
    };
  }

  // Generate recommendations based on scores
  private generateRecommendations(scores: LighthouseScores, metrics: SEOMetrics): string[] {
    const recommendations: string[] = [];
    
    if (scores.performance < 90) {
      if (metrics.largestContentfulPaint > 2500) {
        recommendations.push('Optimize Largest Contentful Paint (LCP) by improving server response times and resource load times');
      }
      if (metrics.firstInputDelay > 100) {
        recommendations.push('Reduce First Input Delay (FID) by breaking up long JavaScript tasks');
      }
      if (metrics.cumulativeLayoutShift > 0.1) {
        recommendations.push('Minimize Cumulative Layout Shift (CLS) by adding size attributes to images and videos');
      }
    }
    
    if (scores.accessibility < 90) {
      recommendations.push('Improve accessibility by adding alt text to images and proper ARIA labels');
    }
    
    if (scores.seo < 90) {
      recommendations.push('Enhance SEO with structured data, meta descriptions, and proper heading hierarchy');
    }
    
    if (scores.bestPractices < 90) {
      recommendations.push('Follow best practices by using HTTPS, avoiding console errors, and proper image sizing');
    }
    
    if (scores.pwa < 50) {
      recommendations.push('Consider implementing Progressive Web App features for better mobile experience');
    }
    
    return recommendations;
  }
}

// Create singleton instance
export const seoMonitor = new SEOMonitor();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    seoMonitor.init();
    
    // Generate initial report after page load
    setTimeout(() => {
      const report = seoMonitor.generateReport();
      console.log('Initial SEO Report:', report);
    }, 5000);
  });
}

// Export for use in components
export const useSEOMonitoring = () => {
  return {
    getMetrics: () => seoMonitor.getMetrics(),
    getScores: () => seoMonitor.generateLighthouseScores(),
    getReport: () => seoMonitor.generateReport(),
    getSEOScore: () => seoMonitor.calculateSEOScore()
  };
};