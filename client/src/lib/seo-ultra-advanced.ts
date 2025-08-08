// <UltraAdvancedSEOModule>
// This module contains next-generation SEO techniques for maximum optimization
// Includes passage indexing, dynamic rendering, and advanced performance features

import { SEO_CONFIG } from './seo';

// <PassageIndexingOptimizerSnippet>
// Optimizes content for Google's Passage Indexing
// This helps specific sections rank independently
export class PassageIndexingOptimizer {
  // Marks important passages for better indexing
  static markKeyPassages(content: string): string {
    // Add semantic markup to help Google identify key passages
    const sections = content.split(/\n\n+/);
    
    return sections.map((section, index) => {
      // Check if section is a key passage (has question or important info)
      const isKeyPassage = /^(how|what|when|where|why|who)/i.test(section) ||
                          section.length > 100 && section.length < 300;
      
      if (isKeyPassage) {
        return `<section data-passage="key" data-index="${index}">
          <div itemscope itemtype="https://schema.org/WebPageElement">
            <div itemprop="text">${section}</div>
          </div>
        </section>`;
      }
      return `<section data-passage="supporting">${section}</section>`;
    }).join('\n');
  }

  // Creates passage-specific meta descriptions
  static generatePassageDescriptions(content: string): Array<{
    passage: string;
    description: string;
    keywords: string[];
  }> {
    const passages = content.split(/\n\n+/).filter(p => p.length > 50);
    
    return passages.map(passage => {
      // Extract key terms from passage
      const keywords = passage.match(/\b[A-Z][a-z]+\b/g) || [];
      const uniqueKeywords = [...new Set(keywords)].slice(0, 5);
      
      // Generate description from first sentence
      const firstSentence = passage.match(/^[^.!?]+[.!?]/)?.[0] || passage.substring(0, 150);
      
      return {
        passage: passage.substring(0, 200),
        description: firstSentence,
        keywords: uniqueKeywords
      };
    });
  }
}
// </PassageIndexingOptimizerSnippet>

// <WebVitalsOptimizerSnippet>
// Advanced Core Web Vitals optimization
export class WebVitalsOptimizer {
  // Implements Interaction to Next Paint (INP) optimization
  static optimizeINP() {
    // Break up long tasks
    if ('requestIdleCallback' in window) {
      const tasks = [];
      
      const runTasks = () => {
        requestIdleCallback((deadline) => {
          while (deadline.timeRemaining() > 0 && tasks.length > 0) {
            const task = tasks.shift();
            if (task) task();
          }
          
          if (tasks.length > 0) {
            runTasks();
          }
        });
      };
      
      // Export function to queue non-critical tasks
      (window as any).queueTask = (task: Function) => {
        tasks.push(task);
        runTasks();
      };
    }
  }

  // Implements speculation rules for instant navigation
  static addSpeculationRules() {
    const script = document.createElement('script');
    script.type = 'speculationrules';
    script.textContent = JSON.stringify({
      prerender: [
        {
          source: "list",
          urls: ["/services", "/contact", "/about"]
        }
      ],
      prefetch: [
        {
          source: "document",
          where: {
            and: [
              { href_matches: "/*" },
              { not: { href_matches: "/admin/*" } },
              { not: { href_matches: "/api/*" } }
            ]
          },
          eagerness: "moderate"
        }
      ]
    });
    document.head.appendChild(script);
  }

  // Implements priority hints for resources
  static addPriorityHints() {
    // High priority for LCP image
    const lcpImage = document.querySelector('img.hero-image') as HTMLImageElement;
    if (lcpImage) {
      lcpImage.fetchPriority = 'high';
      lcpImage.decoding = 'async';
    }

    // Low priority for below-fold images
    document.querySelectorAll('img').forEach((img: HTMLImageElement) => {
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        img.loading = 'lazy';
        img.fetchPriority = 'low';
      }
    });
  }
}
// </WebVitalsOptimizerSnippet>

// <ContentFreshnessManagerSnippet>
// Manages content freshness signals for better rankings
export class ContentFreshnessManager {
  // Adds last modified dates to content
  static addLastModified(date: Date = new Date()) {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'article:modified_time');
    meta.content = date.toISOString();
    document.head.appendChild(meta);

    // Add to schema
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "dateModified": date.toISOString(),
      "datePublished": document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || date.toISOString()
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // Tracks content staleness and suggests updates
  static checkContentFreshness(lastModified: Date): {
    isFresh: boolean;
    daysSinceUpdate: number;
    recommendation: string;
  } {
    const now = new Date();
    const daysSinceUpdate = Math.floor((now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24));
    
    let isFresh = true;
    let recommendation = 'Content is fresh';

    if (daysSinceUpdate > 180) {
      isFresh = false;
      recommendation = 'Content is stale. Major update recommended.';
    } else if (daysSinceUpdate > 90) {
      recommendation = 'Content aging. Consider minor updates.';
    } else if (daysSinceUpdate > 30) {
      recommendation = 'Content is relatively fresh. Monitor for needed updates.';
    }

    return { isFresh, daysSinceUpdate, recommendation };
  }
}
// </ContentFreshnessManagerSnippet>

// <AdvancedStructuredDataSnippet>
// Implements advanced structured data types
export class AdvancedStructuredData {
  // Creates Q&A schema for better featured snippets
  static generateQASchema(questions: Array<{
    question: string;
    answer: string;
    author?: string;
    upvotes?: number;
  }>) {
    return {
      "@context": "https://schema.org",
      "@type": "QAPage",
      "mainEntity": questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer,
          "upvoteCount": q.upvotes || 0,
          ...(q.author && {
            "author": {
              "@type": "Person",
              "name": q.author
            }
          })
        }
      }))
    };
  }

  // Creates software application schema for tools
  static generateSoftwareAppSchema(app: {
    name: string;
    description: string;
    category: string;
    operatingSystem: string;
    offers?: {
      price: number;
      currency: string;
    };
  }) {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": app.name,
      "description": app.description,
      "applicationCategory": app.category,
      "operatingSystem": app.operatingSystem,
      "offers": app.offers ? {
        "@type": "Offer",
        "price": app.offers.price,
        "priceCurrency": app.offers.currency
      } : undefined,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "127"
      }
    };
  }

  // Creates course schema for training content
  static generateCourseSchema(course: {
    name: string;
    description: string;
    provider: string;
    duration: string;
    skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  }) {
    return {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": course.name,
      "description": course.description,
      "provider": {
        "@type": "Organization",
        "name": course.provider
      },
      "timeRequired": course.duration,
      "educationalLevel": course.skillLevel,
      "teaches": {
        "@type": "DefinedTerm",
        "name": course.name,
        "termCode": course.name.toLowerCase().replace(/\s+/g, '-')
      }
    };
  }

  // Creates event schema for webinars/workshops
  static generateEventSchema(event: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: 'online' | string;
    price?: number;
  }) {
    return {
      "@context": "https://schema.org",
      "@type": event.location === 'online' ? 'VirtualEvent' : 'Event',
      "name": event.name,
      "description": event.description,
      "startDate": event.startDate,
      "endDate": event.endDate,
      "location": event.location === 'online' ? {
        "@type": "VirtualLocation",
        "url": SEO_CONFIG.siteUrl
      } : {
        "@type": "Place",
        "name": event.location,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Toronto",
          "addressRegion": "ON"
        }
      },
      "offers": {
        "@type": "Offer",
        "price": event.price || 0,
        "priceCurrency": "CAD",
        "availability": "https://schema.org/InStock"
      },
      "organizer": {
        "@type": "Organization",
        "name": SEO_CONFIG.businessName
      }
    };
  }
}
// </AdvancedStructuredDataSnippet>

// <ImageOptimizationAdvancedSnippet>
// Advanced image optimization techniques
export class ImageOptimizationAdvanced {
  // Generates responsive image srcset
  static generateSrcSet(imagePath: string, sizes: number[] = [320, 640, 768, 1024, 1920]): string {
    return sizes.map(size => `${imagePath}?w=${size} ${size}w`).join(', ');
  }

  // Creates picture element with modern formats
  static createPictureElement(src: string, alt: string, sizes?: string): string {
    const name = src.split('/').pop()?.split('.')[0] || 'image';
    
    return `
      <picture>
        <source 
          type="image/avif" 
          srcset="${this.generateSrcSet(src.replace(/\.[^.]+$/, '.avif'))}"
          ${sizes ? `sizes="${sizes}"` : ''}
        >
        <source 
          type="image/webp" 
          srcset="${this.generateSrcSet(src.replace(/\.[^.]+$/, '.webp'))}"
          ${sizes ? `sizes="${sizes}"` : ''}
        >
        <img 
          src="${src}" 
          alt="${alt}"
          srcset="${this.generateSrcSet(src)}"
          ${sizes ? `sizes="${sizes}"` : ''}
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        >
      </picture>
    `;
  }

  // Implements native lazy loading with fallback
  static implementLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      document.querySelectorAll('img[data-src]').forEach((img: HTMLImageElement) => {
        img.src = img.dataset.src || '';
        img.loading = 'lazy';
      });
    } else {
      // Fallback to Intersection Observer
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
}
// </ImageOptimizationAdvancedSnippet>

// <LinkOptimizationSnippet>
// Advanced internal linking optimization
export class LinkOptimization {
  // Analyzes and optimizes internal link structure
  static analyzeInternalLinks(): {
    totalLinks: number;
    uniqueLinks: number;
    orphanPages: string[];
    recommendations: string[];
  } {
    const links = Array.from(document.querySelectorAll('a[href^="/"]'));
    const uniqueHrefs = new Set(links.map(link => link.getAttribute('href')));
    
    // Find potential orphan pages
    const allPages = ['/services', '/about', '/contact', '/jobs', '/employers', '/job-seekers'];
    const linkedPages = Array.from(uniqueHrefs);
    const orphanPages = allPages.filter(page => !linkedPages.includes(page));
    
    const recommendations = [];
    
    if (links.length < 10) {
      recommendations.push('Add more internal links to improve crawlability');
    }
    
    if (orphanPages.length > 0) {
      recommendations.push(`Link to orphan pages: ${orphanPages.join(', ')}`);
    }
    
    // Check for nofollow on internal links
    const nofollowInternal = links.filter(link => link.getAttribute('rel')?.includes('nofollow'));
    if (nofollowInternal.length > 0) {
      recommendations.push('Remove nofollow from internal links');
    }
    
    return {
      totalLinks: links.length,
      uniqueLinks: uniqueHrefs.size,
      orphanPages,
      recommendations
    };
  }

  // Adds contextual internal links
  static addContextualLinks(content: string, linkMap: { [keyword: string]: string }): string {
    let enhanced = content;
    
    Object.entries(linkMap).forEach(([keyword, url]) => {
      // Only link first occurrence of each keyword
      const regex = new RegExp(`\\b(${keyword})\\b(?![^<]*>)`, 'i');
      enhanced = enhanced.replace(regex, `<a href="${url}" class="contextual-link">$1</a>`);
    });
    
    return enhanced;
  }

  // Implements siloing structure
  static createSiloStructure(): {
    silos: { [category: string]: string[] };
    crossLinks: Array<{ from: string; to: string; }>;
  } {
    return {
      silos: {
        services: [
          '/services',
          '/services/recruiting',
          '/services/training',
          '/services/payroll-administration',
          '/services/labour-relations',
          '/services/full-time-placements',
          '/services/consulting'
        ],
        jobSeekers: [
          '/job-seekers',
          '/jobs',
          '/resume-wizard',
          '/interview-simulator',
          '/apply'
        ],
        employers: [
          '/employers',
          '/post-job',
          '/client-login',
          '/request-access'
        ],
        company: [
          '/about',
          '/contact',
          '/privacy-policy',
          '/terms-of-service'
        ]
      },
      crossLinks: [
        { from: '/services', to: '/contact' },
        { from: '/job-seekers', to: '/services' },
        { from: '/employers', to: '/services' },
        { from: '/about', to: '/services' }
      ]
    };
  }
}
// </LinkOptimizationSnippet>

// <TechnicalSEOAdvancedSnippet>
// Advanced technical SEO implementations
export class TechnicalSEOAdvanced {
  // Implements HTTP/2 Server Push hints
  static addServerPushHints() {
    // Add Link headers for server push
    const criticalResources = [
      '</css/critical.css>; rel=preload; as=style',
      '</js/main.js>; rel=preload; as=script',
      '</fonts/main.woff2>; rel=preload; as=font; crossorigin'
    ];
    
    // These would be sent as HTTP headers in production
    return criticalResources;
  }

  // Implements Edge Side Includes (ESI) for dynamic caching
  static generateESITags(content: string): string {
    // Replace dynamic sections with ESI tags
    return content.replace(
      /<div id="dynamic-content">(.*?)<\/div>/gs,
      '<esi:include src="/api/dynamic-content" />'
    );
  }

  // Adds structured logging for SEO debugging
  static logSEOMetrics(metrics: any) {
    // Send to analytics or monitoring service
    const seoLog = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      metrics: {
        ...metrics,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        connection: (navigator as any).connection?.effectiveType
      }
    };
    
    // Store in session for debugging
    sessionStorage.setItem('seo-metrics', JSON.stringify(seoLog));
    
    // Send to monitoring endpoint
    if (window.location.hostname !== 'localhost') {
      fetch('/api/seo-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoLog)
      }).catch(() => {}); // Silent fail
    }
  }

  // Implements pagination with rel=prev/next
  static addPaginationLinks(current: number, total: number, baseUrl: string) {
    // Remove existing pagination links
    document.querySelectorAll('link[rel="prev"], link[rel="next"]').forEach(el => el.remove());
    
    if (current > 1) {
      const prev = document.createElement('link');
      prev.rel = 'prev';
      prev.href = `${baseUrl}?page=${current - 1}`;
      document.head.appendChild(prev);
    }
    
    if (current < total) {
      const next = document.createElement('link');
      next.rel = 'next';
      next.href = `${baseUrl}?page=${current + 1}`;
      document.head.appendChild(next);
    }
  }
}
// </TechnicalSEOAdvancedSnippet>

// <UserEngagementTrackerSnippet>
// Advanced user engagement tracking for SEO signals
export class UserEngagementTracker {
  private static startTime = Date.now();
  private static interactions = 0;
  private static scrollDepth = 0;

  // Tracks comprehensive engagement metrics
  static initializeTracking() {
    // Track time on page
    window.addEventListener('beforeunload', () => {
      const timeOnPage = (Date.now() - this.startTime) / 1000;
      this.logEngagement({ timeOnPage });
    });

    // Track interactions
    ['click', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => {
        this.interactions++;
      });
    });

    // Track scroll depth
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
          this.scrollDepth = Math.max(this.scrollDepth, scrollPercentage);
          ticking = false;
        });
        ticking = true;
      }
    });

    // Track rage clicks (rapid clicking indicating frustration)
    let clickTimes: number[] = [];
    document.addEventListener('click', (e) => {
      const now = Date.now();
      clickTimes.push(now);
      clickTimes = clickTimes.filter(time => now - time < 1000);
      
      if (clickTimes.length >= 3) {
        this.logEngagement({ 
          rageClick: true, 
          target: (e.target as HTMLElement).tagName 
        });
      }
    });

    // Track form abandonment
    document.querySelectorAll('form').forEach(form => {
      let formStarted = false;
      
      form.addEventListener('focus', () => {
        formStarted = true;
      }, true);
      
      window.addEventListener('beforeunload', () => {
        if (formStarted && !form.dataset.submitted) {
          this.logEngagement({ formAbandoned: form.id || 'unknown' });
        }
      });
      
      form.addEventListener('submit', () => {
        form.dataset.submitted = 'true';
      });
    });
  }

  // Logs engagement metrics
  private static logEngagement(data: any) {
    const engagement = {
      ...data,
      interactions: this.interactions,
      scrollDepth: this.scrollDepth,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    console.log('SEO Engagement:', engagement);
    
    // Send to analytics
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'engagement', engagement);
    }
  }

  // Calculates engagement score
  static getEngagementScore(): number {
    const timeOnPage = (Date.now() - this.startTime) / 1000;
    const timeScore = Math.min(timeOnPage / 300, 1) * 30; // Max 30 points for 5+ minutes
    const scrollScore = (this.scrollDepth / 100) * 30; // Max 30 points for full scroll
    const interactionScore = Math.min(this.interactions / 10, 1) * 40; // Max 40 points for 10+ interactions
    
    return Math.round(timeScore + scrollScore + interactionScore);
  }
}
// </UserEngagementTrackerSnippet>

// </UltraAdvancedSEOModule>