import { SEODashboard } from '@/components/seo-dashboard';
import { SEOHelmet } from '@/components/seo-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function SEOAnalysis() {
  return (
    <>
      <SEOHelmet
        title="SEO Analysis Dashboard - Real-time SEO Score & Metrics"
        description="Comprehensive SEO analysis showing real-time scores, Core Web Vitals, and actionable recommendations to improve search engine optimization."
        keywords={["SEO analysis", "SEO score", "Core Web Vitals", "search engine optimization", "website performance"]}
        canonical="/seo-analysis"
        noIndex={true} // This is an internal tool
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">SEO Analysis Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Real-time SEO scoring and performance metrics for your website
            </p>
          </div>
          
          {/* How SEO Score is Calculated */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How Your SEO Score is Calculated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Your SEO score is calculated based on 100 total points distributed across critical SEO factors:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Technical SEO (45 points)</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Title Tag (10 points)</li>
                      <li>• Meta Description (10 points)</li>
                      <li>• Structured Data (15 points)</li>
                      <li>• Mobile Responsiveness (10 points)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Core Web Vitals (30 points)</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Largest Contentful Paint (10 points)</li>
                      <li>• First Input Delay (10 points)</li>
                      <li>• Cumulative Layout Shift (10 points)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Security & Trust (10 points)</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• HTTPS Security (10 points)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Content & Social (15 points)</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Canonical URL (5 points)</li>
                      <li>• Open Graph Tags (5 points)</li>
                      <li>• Image Alt Text (5 points)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 mt-4">
                  <p className="text-sm">
                    <strong>Current Status:</strong> Your website scores 85/100 points. 
                    The missing 15 points are primarily in:
                  </p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>🔸 Core Web Vitals optimization (5-10 points)</li>
                    <li>🔸 Image optimization and alt text (3-5 points)</li>
                    <li>🔸 Page load speed improvements (2-5 points)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Live Dashboard */}
          <SEODashboard />
          
          {/* Quick Wins Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Wins to Reach 100%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    1. Optimize Images
                    <Badge variant="secondary">+5 points</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Compress images, use WebP format, and implement lazy loading. 
                    Add descriptive alt text to all images for accessibility and SEO.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    2. Improve Core Web Vitals
                    <Badge variant="secondary">+5 points</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Reduce JavaScript execution time, optimize CSS delivery, and minimize layout shifts.
                    Target LCP under 2.5s, FID under 100ms, and CLS under 0.1.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    3. Enhance Page Speed
                    <Badge variant="secondary">+3 points</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable browser caching, minify CSS/JS, use a CDN, and optimize server response times.
                    Aim for page load under 3 seconds.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    4. Add Missing Schema
                    <Badge variant="secondary">+2 points</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Implement additional structured data for reviews, events, and job postings.
                    This helps Google better understand your content.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm">
                  <strong className="text-green-700 dark:text-green-300">Pro Tip:</strong> 
                  Focus on Core Web Vitals first as Google uses these as ranking signals. 
                  The improvements will also enhance user experience, reducing bounce rates and increasing engagement.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}