import { SEO_CONFIG } from "./seo";

// Google E-A-T (Expertise, Authoritativeness, Trustworthiness) optimization
export const GOOGLE_EAT_CONFIG = {
  expertise: {
    // Industry expertise indicators
    yearsOfExperience: "15+",
    certifications: ["WHMIS Certified", "Employment Standards Compliant", "CRA Registered"],
    specializations: ["Manufacturing", "Warehouse", "Construction", "Administrative", "Healthcare"],
    teamLeaderProgram: true,
    profileMatchingSystem: true
  },
  authoritativeness: {
    businessRegistration: "Ontario Corporation",
    googleMyBusiness: true,
    industryAssociations: ["Ontario Employment Agency Association"],
    clientTestimonials: true,
    successRate: "95%",
    placementStats: "1000+ successful placements"
  },
  trustworthiness: {
    secureHTTPS: true,
    privacyPolicy: true,
    termsOfService: true,
    contactInformation: {
      phone: SEO_CONFIG.businessPhone,
      address: SEO_CONFIG.businessAddress,
      businessHours: SEO_CONFIG.businessHours
    },
    transparentPricing: true,
    professionalDesign: true
  }
};

// Google's Core Web Vitals targets
export const CORE_WEB_VITALS = {
  LCP: { // Largest Contentful Paint
    excellent: 2.5, // seconds
    needsImprovement: 4.0
  },
  FID: { // First Input Delay
    excellent: 100, // milliseconds
    needsImprovement: 300
  },
  CLS: { // Cumulative Layout Shift
    excellent: 0.1,
    needsImprovement: 0.25
  },
  FCP: { // First Contentful Paint
    excellent: 1.8,
    needsImprovement: 3.0
  },
  INP: { // Interaction to Next Paint
    excellent: 200,
    needsImprovement: 500
  }
};

// Advanced keyword clusters for Google's semantic search
export const SEMANTIC_KEYWORD_CLUSTERS = {
  primary: {
    "staffing agency toronto": {
      variants: ["staffing companies toronto", "employment agencies toronto", "recruitment firms toronto"],
      intent: "commercial",
      competition: "high",
      searchVolume: "high"
    },
    "temporary staffing gta": {
      variants: ["temp agency gta", "temporary employment gta", "temp staffing greater toronto"],
      intent: "commercial",
      competition: "medium",
      searchVolume: "medium"
    },
    "permanent placement toronto": {
      variants: ["permanent staffing toronto", "direct hire toronto", "full time placement toronto"],
      intent: "commercial",
      competition: "medium",
      searchVolume: "medium"
    }
  },
  longtail: {
    "manufacturing staffing agency mississauga": {
      variants: ["factory workers mississauga", "production staff recruitment mississauga"],
      intent: "commercial",
      competition: "low",
      searchVolume: "low"
    },
    "warehouse staffing toronto airport": {
      variants: ["logistics staffing pearson", "distribution center jobs toronto"],
      intent: "commercial",
      competition: "low",
      searchVolume: "low"
    },
    "whmis training certification free": {
      variants: ["workplace safety training toronto", "hazmat certification ontario"],
      intent: "informational",
      competition: "low",
      searchVolume: "medium"
    }
  },
  local: {
    "staffing agency mississauga": {
      variants: ["employment agency mississauga", "temp agency mississauga"],
      intent: "local",
      competition: "medium",
      searchVolume: "medium"
    },
    "recruitment services brampton": {
      variants: ["staffing solutions brampton", "job placement brampton"],
      intent: "local",
      competition: "low",
      searchVolume: "low"
    }
  }
};

// Google Featured Snippets optimization
export const FEATURED_SNIPPET_CONTENT = {
  whatIs: {
    question: "What is a staffing agency?",
    answer: "A staffing agency is a professional service that connects qualified job seekers with employers looking to fill temporary, permanent, or contract positions. Staffing agencies handle recruitment, screening, training, and placement of candidates.",
    type: "paragraph"
  },
  howTo: {
    question: "How does temporary staffing work?",
    answer: [
      "1. Initial consultation to understand your staffing needs",
      "2. Candidate sourcing and screening from our talent pool",
      "3. Skills assessment and background verification",
      "4. Candidate presentation and interview coordination",
      "5. Placement and ongoing support throughout assignment"
    ],
    type: "list"
  },
  benefits: {
    question: "What are the benefits of using a staffing agency?",
    answer: [
      "Cost savings on recruitment and training",
      "Access to pre-screened qualified candidates", 
      "Flexibility to scale workforce up or down",
      "Reduced administrative burden",
      "Expert knowledge of employment laws",
      "Faster time-to-fill open positions"
    ],
    type: "list"
  }
};

// Google Business Profile optimization
export const GOOGLE_BUSINESS_PROFILE = {
  name: "Talencor Staffing",
  category: "Employment Agency",
  secondaryCategories: ["Temp Agency", "Recruiter", "Human Resource Consulting"],
  description: "Professional staffing agency serving Toronto and GTA. Specializing in temporary staffing, permanent placements, training, payroll administration, and workforce consulting. 15+ years of expertise connecting talent with opportunity.",
  attributes: [
    "Wheelchair accessible",
    "Appointment required",
    "Free consultation",
    "Online services",
    "Accepts credit cards"
  ],
  posts: {
    updates: "Weekly job market updates and hiring tips",
    events: "WHMIS training sessions and career fairs",
    offers: "Free consultation for new clients"
  },
  products: [
    {
      name: "Temporary Staffing",
      category: "Service",
      price: "Competitive rates",
      description: "Flexible temporary workforce solutions"
    },
    {
      name: "Permanent Placement",
      category: "Service", 
      price: "Success-based fee",
      description: "Direct hire recruitment services"
    },
    {
      name: "WHMIS Training",
      category: "Service",
      price: "Free",
      description: "Workplace safety certification"
    }
  ]
};

// Voice search optimization
export const VOICE_SEARCH_OPTIMIZATION = {
  naturalLanguageQueries: [
    "staffing agency near me",
    "where can I find temporary work in Toronto",
    "how do I hire temporary workers",
    "what is the best staffing agency in Toronto",
    "who provides WHMIS training",
    "temporary jobs in mississauga"
  ],
  conversationalKeywords: [
    "find a job",
    "hire staff",
    "temporary work",
    "staffing help",
    "employment services",
    "job placement"
  ]
};

// Page Experience signals for Google
export const PAGE_EXPERIENCE_SIGNALS = {
  mobileFirstIndexing: {
    mobileOptimized: true,
    responsiveDesign: true,
    touchFriendlyElements: true,
    readableText: true
  },
  safetyAndSecurity: {
    httpsSecure: true,
    noMaliciousContent: true,
    safeForWork: true
  },
  userExperience: {
    noIntrusiveInterstitials: true,
    easyNavigation: true,
    clearCTAs: true,
    fastLoading: true
  }
};

// Topic clustering for topical authority
export const TOPIC_CLUSTERS = {
  "staffing-services": {
    pillarPage: "/services",
    clusterPages: [
      "/services/recruiting",
      "/services/training", 
      "/services/payroll-administration",
      "/services/labour-relations",
      "/services/full-time-placements",
      "/services/consulting"
    ],
    keywords: ["staffing services", "workforce solutions", "employment services"]
  },
  "toronto-staffing": {
    pillarPage: "/employers",
    clusterPages: [
      "/services/recruiting",
      "/about",
      "/contact"
    ],
    keywords: ["toronto staffing", "gta employment", "mississauga staffing"]
  },
  "job-seekers": {
    pillarPage: "/job-seekers", 
    clusterPages: [
      "/services/training",
      "/apply",
      "/about"
    ],
    keywords: ["find jobs toronto", "temporary work", "career opportunities"]
  }
};

// Rich Results optimization
export const RICH_RESULTS_CONFIG = {
  faqPage: true,
  howToStructure: true,
  localBusiness: true,
  organization: true,
  breadcrumbs: true,
  sitelinks: true,
  reviews: true,
  events: true
};

// Google algorithm-specific optimizations
export const ALGORITHM_OPTIMIZATIONS = {
  // Google BERT (natural language understanding)
  bert: {
    naturalLanguageContent: true,
    conversationalTone: true,
    contextualRelevance: true,
    userIntentMatching: true
  },
  
  // Google MUM (multitask unified model)
  mum: {
    multimodalContent: true, // text, images, video
    multilanguage: false, // English only for now
    comprehensiveAnswers: true,
    crossTopicConnections: true
  },
  
  // Google RankBrain (AI-powered)
  rankBrain: {
    userBehaviorSignals: true,
    clickThroughRateOptimization: true,
    dwellTimeOptimization: true,
    bounceRateMinimization: true
  },
  
  // Google E-A-T (Expertise, Authoritativeness, Trustworthiness)
  eat: {
    authorCredentials: true,
    businessCredibility: true,
    contentAccuracy: true,
    transparentInformation: true
  }
};