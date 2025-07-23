import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/hero-section";
import ServicesOverview from "@/components/services-overview";
import StatisticsSection from "@/components/statistics-section";
import BenefitsSection from "@/components/benefits-section";
import FAQSection from "@/components/faq-section";
import { CoreWebVitals, initializePerformanceOptimizations } from "@/components/core-web-vitals";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { SEO_CONFIG, generateStructuredData, generateMetaTags } from "@/lib/seo";
import { GOOGLE_BUSINESS_PROFILE, VOICE_SEARCH_OPTIMIZATION } from "@/lib/advanced-seo";
import { useEffect } from "react";
import { captureEvent, captureError, addBreadcrumb } from "@/lib/sentry";

export default function Home() {
  // Initialize performance optimizations
  useEffect(() => {
    initializePerformanceOptimizations();
    
    // Production-ready Sentry tracking
    addBreadcrumb('Home page loaded', 'navigation', {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });
  }, []);

  const seoData = generateMetaTags({
    title: "Professional Staffing Solutions in Toronto & GTA",
    description: "Leading staffing agency in Toronto and GTA providing recruiting, training, payroll administration, labour relations, permanent placements, and consulting services. Contact us today!",
    keywords: [
      ...SEO_CONFIG.keywords.primary,
      ...SEO_CONFIG.keywords.secondary,
      ...SEO_CONFIG.keywords.location,
      "temporary staffing", "workforce management", "employee placement", "HR services",
      // Voice search optimization keywords
      ...VOICE_SEARCH_OPTIMIZATION.conversationalKeywords
    ],
    canonical: "/"
  });

  const organizationData = generateStructuredData("Organization", {});
  const localBusinessData = generateStructuredData("LocalBusiness", {});

  // Google Business Profile structured data
  const googleBusinessData = {
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    "name": GOOGLE_BUSINESS_PROFILE.name,
    "description": GOOGLE_BUSINESS_PROFILE.description,
    "url": SEO_CONFIG.siteUrl,
    "logo": `${SEO_CONFIG.siteUrl}/logo.png`,
    "image": `${SEO_CONFIG.siteUrl}/og-image.jpg`,
    "telephone": SEO_CONFIG.businessPhone,
    "email": "info@talencor.ca",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2985 Drew Rd #206, Airport Business Complex",
      "addressLocality": "Mississauga",
      "addressRegion": "ON",
      "postalCode": "L4T 0A4",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "43.6777",
      "longitude": "-79.6248"
    },
    "openingHours": "Mo-Fr 10:00-17:00",
    "priceRange": "$$",
    "areaServed": [
      {
        "@type": "City",
        "name": "Toronto"
      },
      {
        "@type": "City", 
        "name": "Mississauga"
      },
      {
        "@type": "City",
        "name": "Brampton"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Greater Toronto Area"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Staffing Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Temporary Staffing",
            "description": "Flexible temporary workforce solutions"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Permanent Placement",
            "description": "Direct hire recruitment services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "WHMIS Training",
            "description": "Free workplace safety certification"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Manufacturing Company"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Excellent service and quality candidates. Talencor's Profile-Matching System really works."
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="robots" content={seoData.robots} />
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        <meta property="og:type" content={seoData.ogType} />
        <meta property="og:url" content={seoData.ogUrl} />
        <meta property="og:site_name" content={SEO_CONFIG.siteName} />
        <meta property="og:locale" content="en_CA" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={seoData.twitterCard} />
        <meta name="twitter:title" content={seoData.twitterTitle} />
        <meta name="twitter:description" content={seoData.twitterDescription} />
        
        {/* Local SEO */}
        <meta name="geo.region" content="CA-ON" />
        <meta name="geo.placename" content="Toronto" />
        <meta name="geo.position" content="43.6532;-79.3832" />
        <meta name="ICBM" content="43.6532, -79.3832" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(googleBusinessData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": SEO_CONFIG.siteName,
            "url": SEO_CONFIG.siteUrl,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        
        {/* Google Analytics & Tag Manager - Commented out until actual ID is provided 
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                send_page_view: false
              });
              
              // Enhanced E-commerce tracking ready
              gtag('config', 'GA_MEASUREMENT_ID', {
                custom_map: {'custom_parameter_1': 'service_type'}
              });
              
              // Core Web Vitals tracking
              gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
              });
            `
          }}
        />
        */}
        
        {/* Google Search Console verification - Commented out until actual code is provided
        <meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE" />
        */}
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/montserrat.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </Helmet>

      <HeroSection />
      <ServicesOverview />
      <BenefitsSection />

      {/* Job Seekers Section */}
      <section className="py-20 bg-gradient-to-br from-white to-light-grey relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="hexagon-pattern h-full w-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Diverse workforce collaboration" 
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
                Our clients' success starts with the <span className="text-talencor-gold">right people</span>
              </h2>
              <p className="text-xl text-charcoal mb-8 leading-relaxed">
                Talencor consultants are well-trained staffing professionals, ready to provide you with labour on a seasonal, contingent, or ongoing basis in a variety of employment categories. Each of our unique employees has been handpicked to fit your company's unique culture.
              </p>
              
              <div className="space-y-6 mb-8">
                {[
                  {
                    title: "Carefully Screened & Tested",
                    description: "We pride ourselves on screening each individual cautiously, based on your requirements with skill examinations and specific tests"
                  },
                  {
                    title: "Ready to Work", 
                    description: "Our constantly growing pool of skilled workers can eagerly adapt to an extensive variety of tasks - one day or extensive projects"
                  },
                  {
                    title: "Quality & Work Ethic",
                    description: "Each applicant is judged based on attitude, references and past performance to ensure strong work-ethic while representing our clients"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-talencor-gold rounded-full flex items-center justify-center mr-4">
                      <Check size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold font-montserrat text-navy mb-2">{benefit.title}</h4>
                      <p className="text-charcoal">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto">
                    Request Talent
                  </Button>
                </Link>
                <Link href="/services">
                  <Button 
                    variant="outline" 
                    className="border-2 border-talencor-gold hover:bg-talencor-gold hover:text-white text-talencor-gold px-8 py-4 text-lg font-semibold w-full sm:w-auto"
                  >
                    View Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Employers Section */}
      <section className="py-20 bg-gradient-to-br from-navy to-charcoal text-white relative overflow-hidden border-t-4 border-talencor-gold">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="hexagon-pattern h-full w-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
                Find Your Perfect <span className="text-talencor-gold">Hire</span>
              </h2>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Partner with Talencor to access top talent and streamline your hiring process. Our comprehensive staffing solutions are designed to meet your unique business needs.
              </p>
              
              <div className="space-y-6 mb-8">
                {[
                  {
                    title: "Pre-Screened Candidates",
                    description: "Rigorous screening process ensures you only meet qualified, motivated candidates"
                  },
                  {
                    title: "Faster Time-to-Hire",
                    description: "Reduce your recruitment time by up to 50% with our efficient hiring process"
                  },
                  {
                    title: "Industry Expertise",
                    description: "Specialized knowledge across multiple industries and job functions"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-energetic-orange rounded-full flex items-center justify-center mr-4">
                      <Star size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold font-montserrat mb-2">{benefit.title}</h4>
                      <p className="text-gray-200">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/employers">
                  <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto">
                    Post a Job
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    variant="outline" 
                    className="border-2 border-talencor-gold hover:bg-talencor-gold hover:text-navy text-talencor-gold px-8 py-4 text-lg font-semibold w-full sm:w-auto backdrop-blur-sm bg-white/10"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional business handshake" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <StatisticsSection />
      
      {/* FAQ Section for Google Featured Snippets */}
      <FAQSection maxItems={6} showStructuredData={true} />
      
      {/* Core Web Vitals Component */}
      <CoreWebVitals />
    </>
  );
}
