import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG } from '@/lib/seo';
import { 
  generateComprehensivePageData,
  generateBreadcrumbStructuredData,
  generateRichSnippetData,
  generateEntityData,
  INTERNATIONAL_SEO,
  ADVANCED_META_TAGS
} from '@/lib/seo-comprehensive';

interface SEOHelmetProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical: string;
  type?: string;
  image?: string;
  noIndex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
  structuredData?: any[];
  faq?: any;
  howTo?: any;
  jobPosting?: any;
  reviews?: any;
  events?: any;
  courses?: any;
  customMeta?: Record<string, string>;
  prefetch?: string[];
  preload?: string[];
}

export function SEOHelmet({
  title,
  description,
  keywords = [],
  canonical,
  type = 'website',
  image,
  noIndex = false,
  breadcrumbs = [],
  structuredData = [],
  faq,
  howTo,
  jobPosting,
  reviews,
  events,
  courses,
  customMeta = {},
  prefetch = [],
  preload = []
}: SEOHelmetProps) {
  // Generate comprehensive page data
  const pageData = generateComprehensivePageData({
    title,
    description,
    url: canonical,
    type,
    image,
    noIndex,
    breadcrumbs,
    faq,
    howTo,
    jobPosting,
    reviews,
    events,
    courses,
    prefetch,
    preload
  });

  // Combine all structured data
  const allStructuredData = [
    ...pageData.structuredData,
    ...structuredData,
    // Always include organization/entity data
    generateEntityData()
  ].filter(Boolean);

  // Generate full title with site name
  const fullTitle = title.includes(SEO_CONFIG.siteName) 
    ? title 
    : `${title} | ${SEO_CONFIG.siteName}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={`${SEO_CONFIG.siteUrl}${canonical}`} />
      
      {/* Robots & Crawling */}
      <meta name="robots" content={pageData.meta.robots} />
      <meta name="googlebot" content={pageData.meta.googlebot} />
      <meta name="bingbot" content={pageData.meta.bingbot} />
      
      {/* Open Graph / Facebook */}
      {Object.entries(pageData.openGraph).map(([key, value]) => (
        <meta key={key} property={key} content={value as string} />
      ))}
      
      {/* Twitter */}
      {Object.entries(pageData.twitter).map(([key, value]) => (
        <meta key={key} name={key} content={value as string} />
      ))}
      
      {/* Advanced Meta Tags */}
      <meta name="viewport" content={pageData.meta.viewport} />
      <meta name="format-detection" content={pageData.meta['format-detection']} />
      <meta name="apple-mobile-web-app-capable" content={pageData.meta['apple-mobile-web-app-capable']} />
      <meta name="apple-mobile-web-app-status-bar-style" content={pageData.meta['apple-mobile-web-app-status-bar-style']} />
      <meta name="apple-mobile-web-app-title" content={pageData.meta['apple-mobile-web-app-title']} />
      <meta name="application-name" content={pageData.meta['application-name']} />
      <meta name="mobile-web-app-capable" content={pageData.meta['mobile-web-app-capable']} />
      <meta name="theme-color" content={pageData.meta['theme-color']} />
      <meta name="msapplication-TileColor" content={pageData.meta['msapplication-TileColor']} />
      <meta name="msapplication-navbutton-color" content={pageData.meta['msapplication-navbutton-color']} />
      
      {/* Geographic Tags */}
      <meta name="geo.region" content={pageData.meta['geo.region']} />
      <meta name="geo.placename" content={pageData.meta['geo.placename']} />
      <meta name="geo.position" content={pageData.meta['geo.position']} />
      <meta name="ICBM" content={pageData.meta.ICBM} />
      
      {/* Google Specific */}
      <meta name="google" content={pageData.meta.google} />
      <meta name="rating" content={pageData.meta.rating} />
      <meta name="distribution" content={pageData.meta.distribution} />
      <meta name="revisit-after" content={pageData.meta['revisit-after']} />
      <meta name="author" content={pageData.meta.author} />
      <meta name="publisher" content={pageData.meta.publisher} />
      
      {/* Hreflang Tags for International SEO */}
      {pageData.hreflang.map((item, index) => (
        <link 
          key={index} 
          rel={item.rel} 
          hrefLang={item.hreflang} 
          href={item.href} 
        />
      ))}
      
      {/* Preconnect for Performance */}
      {pageData.preconnect.map((url, index) => (
        <link key={index} rel="preconnect" href={url} />
      ))}
      
      {/* Prefetch for Navigation */}
      {prefetch.map((url, index) => (
        <link key={index} rel="prefetch" href={url} />
      ))}
      
      {/* Preload for Critical Resources */}
      {preload.map((url, index) => (
        <link 
          key={index} 
          rel="preload" 
          href={url} 
          as={url.endsWith('.css') ? 'style' : url.endsWith('.js') ? 'script' : 'fetch'} 
        />
      ))}
      
      {/* Custom Meta Tags */}
      {Object.entries(customMeta).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}
      
      {/* JSON-LD Structured Data */}
      {allStructuredData.map((data, index) => (
        <script 
          key={index} 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      
      {/* LinkedIn Article Tags */}
      <meta property="article:author" content={ADVANCED_META_TAGS.linkedin['article:author']} />
      <meta property="article:publisher" content={ADVANCED_META_TAGS.linkedin['article:publisher']} />
      <meta property="article:published_time" content={new Date().toISOString()} />
      <meta property="article:modified_time" content={new Date().toISOString()} />
      
      {/* Additional Performance & Security Headers */}
      <meta http-equiv="x-dns-prefetch-control" content="on" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
    </Helmet>
  );
}