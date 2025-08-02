import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  FileText, 
  Sparkles, 
  Target, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Key,
  Lightbulb,
  Download,
  RefreshCw
} from 'lucide-react';

interface ResumeSection {
  id?: number;
  sectionType: 'summary' | 'experience' | 'education' | 'skills' | 'achievements';
  originalContent: string;
  enhancedContent?: string;
  feedback?: string;
  score?: number;
  improvements?: string[];
}

interface ResumeSession {
  id?: number;
  sessionId: string;
  targetRole?: string;
  industry?: string;
  overallScore?: number;
  sections?: ResumeSection[];
}

interface ResumeAnalysis {
  overallScore: number;
  sections: {
    [K in ResumeSection['sectionType']]: {
      score: number;
      feedback: string;
      suggestions: string[];
    }
  };
  keywordOptimization: {
    missing: string[];
    present: string[];
    suggestions: string;
  };
  atsOptimization: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  industrySpecific: {
    relevance: number;
    suggestions: string[];
  };
}

const sectionTitles = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  achievements: 'Achievements & Awards'
};

const sectionDescriptions = {
  summary: 'A compelling overview that highlights your career goals and key qualifications',
  experience: 'Your work history with quantifiable achievements and impact',
  education: 'Your educational background, certifications, and relevant coursework',
  skills: 'Technical and soft skills relevant to your target role',
  achievements: 'Notable accomplishments, awards, and recognition'
};

const sectionPlaceholders = {
  summary: `Example:
Results-driven marketing professional with 5+ years of experience in digital marketing and brand management. Proven track record of increasing online engagement by 150% and generating $2M in revenue through strategic campaigns. Skilled in SEO, content marketing, and data analytics.

Tips:
• Keep it 3-4 sentences
• Include years of experience
• Mention 2-3 key achievements with numbers
• Highlight relevant skills`,
  
  experience: `Example:
Marketing Manager | ABC Company | June 2021 - Present
• Led digital marketing team of 5 to execute integrated campaigns across social media, email, and web
• Increased website traffic by 120% through SEO optimization and content strategy
• Managed $500K annual marketing budget and achieved 25% cost reduction
• Launched new product line that generated $1.5M in first-year revenue

Tips:
• Use bullet points for each role
• Start with action verbs (Led, Managed, Increased)
• Include specific numbers and results
• Focus on achievements, not just duties`,
  
  skills: `Example:
Technical Skills:
• Google Analytics, SEMrush, HubSpot
• HTML/CSS, WordPress
• Adobe Creative Suite
• SQL and Excel for data analysis

Soft Skills:
• Project Management
• Team Leadership
• Strategic Planning
• Client Relations

Tips:
• Separate technical and soft skills
• List most relevant skills first
• Match skills to job description
• Be specific (e.g., "Python" not just "Programming")`,
  
  education: `Example:
Bachelor of Science in Marketing
University of California, Los Angeles | 2016-2020
• GPA: 3.8/4.0
• Dean's List: Fall 2018, Spring 2019
• Relevant Coursework: Digital Marketing, Consumer Behavior, Market Research

Tips:
• Include graduation year
• Add GPA if 3.5 or higher
• List relevant coursework
• Include academic honors`,
  
  achievements: `Example:
• Employee of the Year | ABC Company | 2023
• Digital Marketing Excellence Award | Marketing Association | 2022
• Led team that won "Best Campaign" at Industry Awards | 2021
• Published article "Future of Digital Marketing" in Marketing Journal | 2022

Tips:
• Include award name, organization, and year
• List most impressive achievements first
• Include publications, patents, or speaking engagements
• Quantify impact when possible`
};

export default function ResumeWizard() {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [targetRole, setTargetRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [activeSection, setActiveSection] = useState<ResumeSection['sectionType']>('summary');
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({});
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [keywords, setKeywords] = useState<{keywords: string[], explanation: string} | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create session
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/resume/session', { sessionId, targetRole, industry });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resume/session', sessionId] });
    }
  });

  // Get session data
  const { data: sessionData, isLoading: sessionLoading } = useQuery<{ session: ResumeSession }>({
    queryKey: ['/api/resume/session', sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/resume/session?sessionId=${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch session');
      }
      return response.json();
    },
    enabled: !!sessionId,
  });

  // Add/update section
  const addSectionMutation = useMutation({
    mutationFn: async ({ sectionType, content }: { sectionType: string; content: string }) => {
      const response = await apiRequest('POST', '/api/resume/section', { sessionId, sectionType, content });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resume/session', sessionId] });
      toast({
        title: "Section Saved",
        description: "Your resume section has been saved successfully."
      });
    }
  });

  // Analyze resume
  const analyzeResumeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/resume/analyze/${sessionId}`);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }
      return result;
    },
    onSuccess: (data: any) => {
      if (data.analysis) {
        setAnalysis(data.analysis);
        queryClient.invalidateQueries({ queryKey: ['/api/resume/session', sessionId] });
        toast({
          title: "Analysis Complete",
          description: `Your resume scored ${data.analysis.overallScore}/100. Check the feedback for improvements.`
        });
      } else {
        toast({
          title: "Analysis Error",
          description: "Analysis completed but no results were returned.",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Enhance section
  const enhanceSectionMutation = useMutation({
    mutationFn: async (sectionType: string) => {
      const response = await apiRequest('POST', `/api/resume/enhance/${sessionId}/${sectionType}`);
      return response.json();
    },
    onSuccess: (data, sectionType) => {
      queryClient.invalidateQueries({ queryKey: ['/api/resume/session', sessionId] });
      toast({
        title: "Enhancement Complete",
        description: `Your ${sectionTitles[sectionType as keyof typeof sectionTitles]} section has been enhanced with AI suggestions.`
      });
    }
  });

  // Get keyword suggestions
  const keywordsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/resume/keywords/${sessionId}`, { targetRole, industry });
      return response.json();
    },
    onSuccess: (data: any) => {
      setKeywords(data.keywords);
      toast({
        title: "Keywords Generated",
        description: "AI-powered keyword suggestions are ready to improve your ATS compatibility."
      });
    }
  });

  // Initialize session on load
  useEffect(() => {
    if (sessionId && !sessionData) {
      createSessionMutation.mutate();
    }
  }, [sessionId]);

  // Update session when target role or industry changes
  useEffect(() => {
    if (sessionData && (targetRole || industry)) {
      const timer = setTimeout(() => {
        createSessionMutation.mutate();
      }, 1000); // Debounce updates
      return () => clearTimeout(timer);
    }
  }, [targetRole, industry]);

  // Load section content from session data
  useEffect(() => {
    if (sessionData?.session?.sections) {
      const contentMap: Record<string, string> = {};
      sessionData.session.sections.forEach((section: ResumeSection) => {
        contentMap[section.sectionType] = section.originalContent;
      });
      setSectionContent(contentMap);
    }
  }, [sessionData]);

  const handleSaveSection = () => {
    const content = sectionContent[activeSection];
    if (!content?.trim()) {
      toast({
        title: "Content Required",
        description: "Please add content to this section before saving.",
        variant: "destructive"
      });
      return;
    }

    addSectionMutation.mutate({
      sectionType: activeSection,
      content: content.trim()
    });
  };

  const handleAnalyzeResume = () => {
    if (!targetRole || !industry) {
      toast({
        title: "Missing Information",
        description: "Please enter your target role and industry before analyzing.",
        variant: "destructive"
      });
      return;
    }

    const sections = sessionData?.session?.sections || [];
    if (sections.length === 0) {
      toast({
        title: "No Content",
        description: "Please add at least one resume section before analyzing.",
        variant: "destructive"
      });
      return;
    }

    analyzeResumeMutation.mutate();
  };

  const handleEnhanceSection = (sectionType: string) => {
    enhanceSectionMutation.mutate(sectionType);
  };

  const handleGenerateKeywords = () => {
    if (!targetRole || !industry) {
      toast({
        title: "Missing Information",
        description: "Please enter your target role and industry for keyword suggestions.",
        variant: "destructive"
      });
      return;
    }

    keywordsMutation.mutate();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-orange-500" />
            AI Resume Enhancement Wizard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Transform your resume with AI-powered analysis, real-time feedback, and ATS optimization
          </p>
          
          {/* Getting Started Guide */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-4xl mx-auto text-left">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Quick Start Guide - How to Use This Wizard
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center font-semibold">1</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Set Your Target</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enter your desired job role and industry below</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center font-semibold">2</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Fill Each Section</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click through the tabs and add your information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center font-semibold">3</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Save Your Content</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click "Save Section" after entering each part</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full text-sm flex items-center justify-center font-semibold">4</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Get AI Analysis</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click "Analyze Resume" for instant feedback and scoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full text-sm flex items-center justify-center font-semibold">5</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">AI Enhancement</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Use "AI Enhance" to improve any section instantly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full text-sm flex items-center justify-center font-semibold">6</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">ATS Keywords</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get keyword suggestions to pass applicant tracking systems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Target Role & Industry */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-orange-500" />
              Target Position Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Enter your desired job title and industry to get personalized AI recommendations tailored to your career goals.</span>
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Role <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Be specific: "Senior Frontend Developer" is better than "Developer"
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Technology, Healthcare, Finance"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This helps AI suggest industry-specific keywords and formats
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {sessionData?.session?.sections?.length || 0} of 5 sections completed
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {Math.round(((sessionData?.session?.sections?.length || 0) / 5) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((sessionData?.session?.sections?.length || 0) / 5) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as ResumeSection['sectionType'])}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                {Object.entries(sectionTitles).map(([key, title]) => (
                  <TabsTrigger key={key} value={key} className="text-xs">
                    {title.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(sectionTitles).map(([sectionType, title]) => (
                <TabsContent key={sectionType} value={sectionType}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="text-orange-500" />
                          {title}
                        </div>
                        {sessionData?.session?.sections?.find((s: ResumeSection) => s.sectionType === sectionType) && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Saved
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {sectionDescriptions[sectionType as keyof typeof sectionDescriptions]}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder={sectionPlaceholders[sectionType as keyof typeof sectionPlaceholders]}
                        className="min-h-[300px] font-mono text-sm"
                        value={sectionContent[sectionType] || ''}
                        onChange={(e) => setSectionContent(prev => ({
                          ...prev,
                          [sectionType]: e.target.value
                        }))}
                      />

                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSaveSection}
                          disabled={addSectionMutation.isPending}
                        >
                          {addSectionMutation.isPending ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Save Section
                            </>
                          )}
                        </Button>

                        {sessionData?.session?.sections?.find((s: ResumeSection) => s.sectionType === sectionType) && (
                          <Button 
                            variant="outline"
                            onClick={() => handleEnhanceSection(sectionType)}
                            disabled={enhanceSectionMutation.isPending}
                          >
                            {enhanceSectionMutation.isPending ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Enhancing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                AI Enhance
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Enhanced Content Display */}
                      {sessionData?.session?.sections?.find((s: ResumeSection) => s.sectionType === sectionType)?.enhancedContent && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            AI Enhanced Version
                          </h4>
                          <div className="whitespace-pre-wrap text-sm text-green-700 dark:text-green-300">
                            {sessionData.session.sections.find((s: ResumeSection) => s.sectionType === sectionType)?.enhancedContent}
                          </div>
                          {sessionData.session.sections.find((s: ResumeSection) => s.sectionType === sectionType)?.improvements && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">Key Improvements:</p>
                              <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                                {sessionData.session.sections.find((s: ResumeSection) => s.sectionType === sectionType)?.improvements?.map((improvement: string, index: number) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <span className="text-green-500">•</span>
                                    {improvement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analysis Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-orange-500" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleAnalyzeResume}
                  disabled={analyzeResumeMutation.isPending}
                  className="w-full"
                >
                  {analyzeResumeMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline"
                  onClick={handleGenerateKeywords}
                  disabled={keywordsMutation.isPending}
                  className="w-full"
                >
                  {keywordsMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Get Keywords
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Overall Score */}
            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Overall Score</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}/100
                  </div>
                  <Progress value={analysis.overallScore} className="mt-4" />
                  <Badge 
                    variant={getScoreBadgeVariant(analysis.overallScore)} 
                    className="mt-2"
                  >
                    {analysis.overallScore >= 80 ? 'Excellent' : 
                     analysis.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* Section Scores */}
            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Section Scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(analysis.sections).map(([sectionType, sectionAnalysis]) => (
                    <div key={sectionType} className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {sectionTitles[sectionType as keyof typeof sectionTitles]}
                      </span>
                      <Badge variant={getScoreBadgeVariant(sectionAnalysis.score)}>
                        {sectionAnalysis.score}/100
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* ATS Optimization */}
            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="text-orange-500" />
                    ATS Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">ATS Score</span>
                    <Badge variant={getScoreBadgeVariant(analysis.atsOptimization.score)}>
                      {analysis.atsOptimization.score}/100
                    </Badge>
                  </div>
                  {analysis.atsOptimization.issues.length > 0 && (
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <div className="text-sm space-y-1">
                          <p className="font-medium">Key Issues:</p>
                          <ul className="space-y-1">
                            {analysis.atsOptimization.issues.slice(0, 3).map((issue, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-orange-500">•</span>
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Keywords */}
            {keywords && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="text-orange-500" />
                    Suggested Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {keywords.keywords.slice(0, 8).map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {keywords.explanation}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}