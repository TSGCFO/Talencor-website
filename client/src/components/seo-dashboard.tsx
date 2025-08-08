import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useSEOMonitoring } from '@/lib/seo-monitoring';

interface SEOMetric {
  name: string;
  score: number;
  maxScore: number;
  status: 'pass' | 'warning' | 'fail';
  description: string;
  fix?: string;
}

export function SEODashboard() {
  const { getScores, getMetrics, getReport } = useSEOMonitoring();
  const [scores, setScores] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [detailedBreakdown, setDetailedBreakdown] = useState<SEOMetric[]>([]);

  useEffect(() => {
    const updateData = () => {
      const currentScores = getScores();
      const currentMetrics = getMetrics();
      const report = getReport();
      
      setScores(currentScores);
      setMetrics(currentMetrics);
      
      // Calculate detailed breakdown
      const breakdown: SEOMetric[] = [
        {
          name: 'Title Tag',
          score: document.title ? 10 : 0,
          maxScore: 10,
          status: document.title ? 'pass' : 'fail',
          description: 'Page has a unique, descriptive title tag',
          fix: !document.title ? 'Add a descriptive title tag (30-60 characters)' : undefined
        },
        {
          name: 'Meta Description',
          score: document.querySelector('meta[name="description"]') ? 10 : 0,
          maxScore: 10,
          status: document.querySelector('meta[name="description"]') ? 'pass' : 'fail',
          description: 'Page has a meta description',
          fix: !document.querySelector('meta[name="description"]') ? 'Add a meta description (120-160 characters)' : undefined
        },
        {
          name: 'Structured Data',
          score: document.querySelectorAll('script[type="application/ld+json"]').length > 0 ? 15 : 0,
          maxScore: 15,
          status: document.querySelectorAll('script[type="application/ld+json"]').length > 0 ? 'pass' : 'fail',
          description: 'Page includes JSON-LD structured data',
          fix: document.querySelectorAll('script[type="application/ld+json"]').length === 0 ? 'Add structured data for rich snippets' : undefined
        },
        {
          name: 'Core Web Vitals - LCP',
          score: currentMetrics.largestContentfulPaint <= 2500 ? 10 : currentMetrics.largestContentfulPaint <= 4000 ? 5 : 0,
          maxScore: 10,
          status: currentMetrics.largestContentfulPaint <= 2500 ? 'pass' : currentMetrics.largestContentfulPaint <= 4000 ? 'warning' : 'fail',
          description: `Largest Contentful Paint: ${currentMetrics.largestContentfulPaint}ms`,
          fix: currentMetrics.largestContentfulPaint > 2500 ? 'Optimize images and server response time' : undefined
        },
        {
          name: 'Core Web Vitals - FID',
          score: currentMetrics.firstInputDelay <= 100 ? 10 : currentMetrics.firstInputDelay <= 300 ? 5 : 0,
          maxScore: 10,
          status: currentMetrics.firstInputDelay <= 100 ? 'pass' : currentMetrics.firstInputDelay <= 300 ? 'warning' : 'fail',
          description: `First Input Delay: ${currentMetrics.firstInputDelay}ms`,
          fix: currentMetrics.firstInputDelay > 100 ? 'Reduce JavaScript execution time' : undefined
        },
        {
          name: 'Core Web Vitals - CLS',
          score: currentMetrics.cumulativeLayoutShift <= 0.1 ? 10 : currentMetrics.cumulativeLayoutShift <= 0.25 ? 5 : 0,
          maxScore: 10,
          status: currentMetrics.cumulativeLayoutShift <= 0.1 ? 'pass' : currentMetrics.cumulativeLayoutShift <= 0.25 ? 'warning' : 'fail',
          description: `Cumulative Layout Shift: ${currentMetrics.cumulativeLayoutShift.toFixed(3)}`,
          fix: currentMetrics.cumulativeLayoutShift > 0.1 ? 'Add size attributes to images and videos' : undefined
        },
        {
          name: 'Mobile Responsiveness',
          score: document.querySelector('meta[name="viewport"]') ? 10 : 0,
          maxScore: 10,
          status: document.querySelector('meta[name="viewport"]') ? 'pass' : 'fail',
          description: 'Page is mobile-friendly with viewport meta tag',
          fix: !document.querySelector('meta[name="viewport"]') ? 'Add viewport meta tag for mobile' : undefined
        },
        {
          name: 'HTTPS Security',
          score: window.location.protocol === 'https:' ? 10 : 0,
          maxScore: 10,
          status: window.location.protocol === 'https:' ? 'pass' : 'fail',
          description: 'Page is served over secure HTTPS',
          fix: window.location.protocol !== 'https:' ? 'Enable HTTPS for security' : undefined
        },
        {
          name: 'Canonical URL',
          score: document.querySelector('link[rel="canonical"]') ? 5 : 0,
          maxScore: 5,
          status: document.querySelector('link[rel="canonical"]') ? 'pass' : 'fail',
          description: 'Page has a canonical URL specified',
          fix: !document.querySelector('link[rel="canonical"]') ? 'Add canonical URL to prevent duplicate content' : undefined
        },
        {
          name: 'Open Graph Tags',
          score: document.querySelector('meta[property^="og:"]') ? 5 : 0,
          maxScore: 5,
          status: document.querySelector('meta[property^="og:"]') ? 'pass' : 'fail',
          description: 'Page has Open Graph tags for social sharing',
          fix: !document.querySelector('meta[property^="og:"]') ? 'Add Open Graph tags for better social sharing' : undefined
        },
        {
          name: 'Image Alt Text',
          score: calculateImageAltScore(),
          maxScore: 5,
          status: calculateImageAltScore() === 5 ? 'pass' : calculateImageAltScore() > 0 ? 'warning' : 'fail',
          description: 'Images have descriptive alt text',
          fix: calculateImageAltScore() < 5 ? 'Add alt text to all images' : undefined
        },
        {
          name: 'Page Load Speed',
          score: currentMetrics.pageLoadTime < 3000 ? 10 : currentMetrics.pageLoadTime < 5000 ? 5 : 0,
          maxScore: 10,
          status: currentMetrics.pageLoadTime < 3000 ? 'pass' : currentMetrics.pageLoadTime < 5000 ? 'warning' : 'fail',
          description: `Page load time: ${Math.abs(currentMetrics.pageLoadTime)}ms`,
          fix: currentMetrics.pageLoadTime > 3000 ? 'Optimize assets and reduce server response time' : undefined
        }
      ];
      
      setDetailedBreakdown(breakdown);
    };
    
    updateData();
    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  }, []);
  
  function calculateImageAltScore(): number {
    const images = document.querySelectorAll('img');
    if (images.length === 0) return 5;
    const imagesWithAlt = Array.from(images).filter(img => img.alt).length;
    return Math.round((imagesWithAlt / images.length) * 5);
  }
  
  const totalScore = detailedBreakdown.reduce((sum, item) => sum + item.score, 0);
  const maxPossibleScore = detailedBreakdown.reduce((sum, item) => sum + item.maxScore, 0);
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);
  
  const missingPoints = detailedBreakdown.filter(item => item.score < item.maxScore);
  
  return (
    <div className="space-y-6 p-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SEO Score Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{percentage}%</div>
              <p className="text-muted-foreground mt-2">Overall SEO Score</p>
            </div>
            <Progress value={percentage} className="h-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Points Earned:</span> {totalScore}/{maxPossibleScore}
              </div>
              <div>
                <span className="font-semibold">Points Missing:</span> {maxPossibleScore - totalScore}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed SEO Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {detailedBreakdown.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {metric.status === 'pass' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : metric.status === 'warning' ? (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-semibold">{metric.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
                    {metric.fix && (
                      <Alert className="mt-2">
                        <AlertDescription className="text-sm">
                          <strong>To improve:</strong> {metric.fix}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-lg font-semibold">{metric.score}/{metric.maxScore}</span>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Improvement Recommendations */}
      {missingPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>How to Get the Remaining {100 - percentage}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {missingPoints
                .sort((a, b) => (b.maxScore - b.score) - (a.maxScore - a.score))
                .slice(0, 5)
                .map((metric, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold">{metric.name}</p>
                      <p className="text-sm text-muted-foreground">{metric.fix || metric.description}</p>
                      <p className="text-sm text-primary mt-1">
                        Potential gain: +{metric.maxScore - metric.score} points ({Math.round(((metric.maxScore - metric.score) / maxPossibleScore) * 100)}%)
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals (Real-time)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">LCP</p>
              <p className="text-2xl font-bold">{metrics?.largestContentfulPaint || 0}ms</p>
              <p className="text-xs">Target: &lt;2500ms</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">FID</p>
              <p className="text-2xl font-bold">{metrics?.firstInputDelay || 0}ms</p>
              <p className="text-xs">Target: &lt;100ms</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">CLS</p>
              <p className="text-2xl font-bold">{metrics?.cumulativeLayoutShift?.toFixed(3) || 0}</p>
              <p className="text-xs">Target: &lt;0.1</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}