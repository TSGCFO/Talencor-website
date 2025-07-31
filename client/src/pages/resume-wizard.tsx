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
      return apiRequest('/api/resume/session', 'POST', { sessionId, targetRole, industry });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resume/session', sessionId] });
    }
  });

  // Get session data
  const { data: sessionData, isLoading: sessionLoading } = useQuery<{ session: ResumeSession }>({
    queryKey: ['/api/resume/session', sessionId],
    enabled: !!sessionId,
  });

  // Add/update section
  const addSectionMutation = useMutation({
    mutationFn: async ({ sectionType, content }: { sectionType: string; content: string }) => {
      return apiRequest('/api/resume/section', 'POST', { sessionId, sectionType, content });
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
      return apiRequest(`/api/resume/analyze/${sessionId}`, 'POST');
    },
    onSuccess: (data: any) => {
      setAnalysis(data.analysis);
      queryClient.invalidateQueries({ queryKey: ['/api/resume/session', sessionId] });
      toast({
        title: "Analysis Complete",
        description: `Your resume scored ${data.analysis.overallScore}/100. Check the feedback for improvements.`
      });
    }
  });

  // Enhance section
  const enhanceSectionMutation = useMutation({
    mutationFn: async (sectionType: string) => {
      return apiRequest(`/api/resume/enhance/${sessionId}/${sectionType}`, 'POST');
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
      return apiRequest(`/api/resume/keywords/${sessionId}`, 'POST', { targetRole, industry });
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
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your resume with AI-powered analysis, real-time feedback, and ATS optimization
          </p>
        </div>

        {/* Target Role & Industry */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-orange-500" />
              Target Position Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Role</label>
              <Input
                placeholder="e.g., Software Engineer, Marketing Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <Input
                placeholder="e.g., Technology, Healthcare, Finance"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
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
                        placeholder={`Enter your ${title.toLowerCase()} content here...`}
                        className="min-h-[200px]"
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