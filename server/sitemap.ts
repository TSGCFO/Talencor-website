export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (entries: SitemapEntry[]): string => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://talencor-staffing.replit.app' 
    : 'http://localhost:5000';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(entry => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
    <xhtml:link rel="alternate" hreflang="en-ca" href="${baseUrl}${entry.url}" />
    <xhtml:link rel="alternate" hreflang="en-us" href="${baseUrl}${entry.url}?region=us" />
    <xhtml:link rel="alternate" hreflang="fr-ca" href="${baseUrl}/fr${entry.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${entry.url}" />
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

export const sitemapEntries: SitemapEntry[] = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/services',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/services/recruiting',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/services/training',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/services/payroll-administration',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/services/labour-relations',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/services/full-time-placements',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/services/consulting',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/job-seekers',
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/employers',
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/apply',
    changefreq: 'monthly',
    priority: 0.5,
    lastmod: new Date().toISOString().split('T')[0]
  }
];

export const generateRobotsTxt = (): string => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://talencor-staffing.replit.app' 
    : 'http://localhost:5000';

  return `# Robots.txt for Talencor Staffing
# Last updated: ${new Date().toISOString().split('T')[0]}

# Google Bot
User-agent: Googlebot
Allow: /
Allow: /services/
Allow: /job-seekers
Allow: /employers
Allow: /contact
Allow: /about
Allow: /apply
Crawl-delay: 0

# Bing Bot
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# All other bots
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$
Disallow: /*?
Allow: /*?region=
Allow: /*?utm_
Crawl-delay: 2

# Specific bot directives
User-agent: AdsBot-Google
Allow: /

User-agent: Googlebot-Image
Allow: /
Allow: *.jpg
Allow: *.jpeg
Allow: *.png
Allow: *.webp
Allow: *.svg

User-agent: Googlebot-Mobile
Allow: /

# AI and LLM Crawlers
User-agent: GPTBot
Allow: /
Crawl-delay: 3

User-agent: ChatGPT-User
Allow: /
Crawl-delay: 3

User-agent: CCBot
Allow: /
Crawl-delay: 5

User-agent: anthropic-ai
Allow: /
Crawl-delay: 3

User-agent: Claude-Web
Allow: /
Crawl-delay: 3

# Social Media Crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Block bad bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-services.xml
Sitemap: ${baseUrl}/sitemap-jobs.xml

# Host directive (non-standard but supported by some crawlers)
Host: ${baseUrl}
`;
};