export const SEO_CONFIG = {
  siteName: "Talencor Staffing",
  siteUrl: import.meta.env.PROD ? 'https://talencor-staffing.replit.app' : 'http://localhost:5000',
  defaultTitle: "Talencor Staffing | Professional Staffing Solutions in Toronto & GTA",
  defaultDescription: "Leading staffing agency in Toronto and GTA providing recruiting, training, payroll administration, labour relations, permanent placements, and consulting services.",
  defaultImage: "/og-image.jpg",
  twitterHandle: "@TalencorStaffing",
  businessPhone: "(647) 946-2177",
  businessAddress: "2985 Drew Rd #206, Airport Business Complex, Mississauga, ON",
  businessHours: "Monday-Friday 10 AM-5 PM",
  businessName: "Talencor Staffing",
  keywords: {
    primary: ["staffing agency Toronto", "recruitment services GTA", "temporary staffing", "permanent placement", "workforce solutions"],
    secondary: ["employee training", "payroll services", "labour relations", "HR consulting", "WHMIS certification"],
    location: ["Toronto staffing", "GTA recruitment", "Mississauga staffing", "Ontario workforce", "Greater Toronto Area"]
  }
};

export const generateStructuredData = (type: string, data: any) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };

  if (type === "Organization") {
    return {
      ...baseData,
      name: SEO_CONFIG.businessName,
      url: SEO_CONFIG.siteUrl,
      logo: `${SEO_CONFIG.siteUrl}/logo.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: SEO_CONFIG.businessPhone,
        contactType: "customer service",
        areaServed: "CA",
        availableLanguage: "English"
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "2985 Drew Rd #206, Airport Business Complex",
        addressLocality: "Mississauga",
        addressRegion: "ON",
        postalCode: "L4T 0A4",
        addressCountry: "CA"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "43.6777",
        longitude: "-79.6248"
      },
      openingHours: "Mo-Fr 10:00-17:00",
      sameAs: [
        "https://www.linkedin.com/company/talencor-staffing",
        "https://www.facebook.com/TalencorStaffing"
      ]
    };
  }

  if (type === "LocalBusiness") {
    return {
      ...baseData,
      "@type": "EmploymentAgency",
      name: SEO_CONFIG.businessName,
      image: `${SEO_CONFIG.siteUrl}/logo.png`,
      telephone: SEO_CONFIG.businessPhone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "2985 Drew Rd #206, Airport Business Complex",
        addressLocality: "Mississauga",
        addressRegion: "ON",
        postalCode: "L4T 0A4",
        addressCountry: "CA"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "43.6777",
        longitude: "-79.6248"
      },
      url: SEO_CONFIG.siteUrl,
      openingHours: "Mo-Fr 10:00-17:00",
      priceRange: "$$",
      servedCuisine: "Staffing Services",
      areaServed: {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "43.6532",
          "longitude": "-79.3832"
        },
        "geoRadius": "50000"
      }
    };
  }

  return baseData;
};

export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${SEO_CONFIG.siteUrl}${crumb.url}`
    }))
  };
};

export const generateFAQStructuredData = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateServiceStructuredData = (service: {
  name: string;
  description: string;
  serviceType: string;
  areaServed: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": SEO_CONFIG.businessName,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2985 Drew Rd #206, Airport Business Complex",
        "addressLocality": "Mississauga",
        "addressRegion": "ON",
        "addressCountry": "CA"
      },
      "telephone": SEO_CONFIG.businessPhone
    },
    "serviceType": service.serviceType,
    "areaServed": service.areaServed
  };
};

// SEO Meta Tag Helpers
export const generateMetaTags = (page: {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
}) => {
  const fullTitle = page.title.includes(SEO_CONFIG.siteName) 
    ? page.title 
    : `${page.title} | ${SEO_CONFIG.siteName}`;
  
  return {
    title: fullTitle,
    description: page.description,
    keywords: page.keywords?.join(', ') || SEO_CONFIG.keywords.primary.join(', '),
    canonical: page.canonical ? `${SEO_CONFIG.siteUrl}${page.canonical}` : undefined,
    robots: page.noIndex ? 'noindex,nofollow' : 'index,follow',
    ogTitle: fullTitle,
    ogDescription: page.description,
    ogType: 'website',
    ogUrl: page.canonical ? `${SEO_CONFIG.siteUrl}${page.canonical}` : SEO_CONFIG.siteUrl,
    ogImage: SEO_CONFIG.defaultImage,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: page.description,
    twitterImage: SEO_CONFIG.defaultImage
  };
};

// Core Web Vitals and Performance
export const PERFORMANCE_CONFIG = {
  // Image optimization settings
  imageOptimization: {
    quality: 85,
    formats: ['webp', 'avif', 'jpg'],
    breakpoints: [640, 768, 1024, 1280, 1536]
  },
  
  // Critical CSS paths
  criticalCSS: [
    '/src/index.css',
    '/src/components/ui'
  ],
  
  // Preload critical resources
  preloadResources: [
    { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    { href: '/fonts/montserrat.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
  ]
};