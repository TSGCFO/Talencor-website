import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Upload, FileText, Sparkles, Download, Copy, Check, ChevronLeft, ChevronRight, Wand2, Target, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/micro-interactions";
import { cn } from "@/lib/utils";

interface EnhancementOptions {
  formatting: boolean;
  keywords: boolean;
  achievements: boolean;
  skills: boolean;
  summary: boolean;
}

export default function ResumeWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeText, setResumeText] = useState("");
  const [enhancementOptions, setEnhancementOptions] = useState<EnhancementOptions>({
    formatting: true,
    keywords: true,
    achievements: true,
    skills: true,
    summary: true,
  });
  const [jobCategory, setJobCategory] = useState("general");
  const [enhancedResume, setEnhancedResume] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const steps = [
    { number: 1, title: "Upload Resume", icon: Upload },
    { number: 2, title: "Select Enhancements", icon: Sparkles },
    { number: 3, title: "Review & Download", icon: Download },
  ];

  const jobCategories = [
    { value: "general", label: "General/All Industries" },
    { value: "tech", label: "Technology & IT" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance & Banking" },
    { value: "retail", label: "Retail & Sales" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "hospitality", label: "Hospitality & Tourism" },
    { value: "education", label: "Education" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
        toast({
          title: "Resume uploaded",
          description: "Your resume has been successfully loaded.",
        });
      };
      reader.readAsText(file);
    }
  };

  const handleEnhance = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch("/api/enhance-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobCategory,
          options: enhancementOptions,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to enhance resume");
      }

      setEnhancedResume(data.enhancedResume);
      setIsProcessing(false);
      setCurrentStep(3);
      
      toast({
        title: "Resume enhanced!",
        description: "Your resume has been optimized with AI-powered improvements.",
      });

      // Show additional suggestions if available
      if (data.suggestions && data.suggestions.length > 0) {
        console.log("Additional suggestions:", data.suggestions);
      }
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Enhancement failed",
        description: error instanceof Error ? error.message : "Failed to enhance resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Your enhanced resume has been copied.",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([enhancedResume], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced-resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Resume downloaded",
      description: "Your enhanced resume has been saved.",
    });
  };

  return (
    <>
      <Helmet>
        <title>AI-Powered Resume Enhancement Wizard | Talencor Staffing</title>
        <meta 
          name="description" 
          content="Transform your resume with our AI-powered enhancement wizard. Optimize keywords, improve formatting, and highlight achievements to stand out to employers." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-talencor-gold/20 p-4 rounded-full">
                <Wand2 className="h-12 w-12 text-talencor-gold" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
              AI-Powered Resume Enhancement
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Transform your resume into a powerful career tool with intelligent enhancements tailored to your industry
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                  currentStep >= step.number
                    ? "bg-talencor-gold text-white"
                    : "bg-gray-200 text-gray-500"
                )}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className={cn(
                    "text-sm font-semibold transition-colors",
                    currentStep >= step.number ? "text-navy" : "text-gray-500"
                  )}>
                    Step {step.number}
                  </p>
                  <p className={cn(
                    "text-xs transition-colors",
                    currentStep >= step.number ? "text-charcoal" : "text-gray-400"
                  )}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-24 h-1 mx-4 transition-colors",
                    currentStep > step.number ? "bg-talencor-gold" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1: Upload Resume */}
          {currentStep === 1 && (
            <AnimatedCard>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="h-6 w-6 text-talencor-gold" />
                    Upload Your Resume
                  </CardTitle>
                  <CardDescription>
                    Paste your resume text or upload a text file to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="resume-text">Resume Content</Label>
                    <Textarea
                      id="resume-text"
                      placeholder="Paste your resume here..."
                      className="min-h-[300px] mt-2"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="border-t border-gray-300"></div>
                    </div>
                    <span className="text-gray-500 text-sm">OR</span>
                    <div className="flex-1">
                      <div className="border-t border-gray-300"></div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-talencor-gold transition-colors">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Click to upload a text file</p>
                        <p className="text-sm text-gray-500 mt-1">Supported: .txt, .doc, .docx</p>
                      </div>
                    </Label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={!resumeText}
                      className="bg-talencor-gold hover:bg-talencor-orange"
                    >
                      Next Step
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          )}

          {/* Step 2: Enhancement Options */}
          {currentStep === 2 && (
            <AnimatedCard>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-talencor-gold" />
                    Select Enhancement Options
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to enhance your resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Target Industry</Label>
                    <RadioGroup value={jobCategory} onValueChange={setJobCategory}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {jobCategories.map((category) => (
                          <div key={category.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={category.value} id={category.value} />
                            <Label 
                              htmlFor={category.value} 
                              className="cursor-pointer font-normal"
                            >
                              {category.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Enhancement Features</Label>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="formatting"
                          checked={enhancementOptions.formatting}
                          onCheckedChange={(checked) => 
                            setEnhancementOptions(prev => ({ ...prev, formatting: checked as boolean }))
                          }
                        />
                        <div>
                          <Label htmlFor="formatting" className="cursor-pointer">
                            Professional Formatting
                          </Label>
                          <p className="text-sm text-gray-600">Optimize layout and structure for ATS systems</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="keywords"
                          checked={enhancementOptions.keywords}
                          onCheckedChange={(checked) => 
                            setEnhancementOptions(prev => ({ ...prev, keywords: checked as boolean }))
                          }
                        />
                        <div>
                          <Label htmlFor="keywords" className="cursor-pointer">
                            Keyword Optimization
                          </Label>
                          <p className="text-sm text-gray-600">Add industry-specific keywords for better visibility</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="achievements"
                          checked={enhancementOptions.achievements}
                          onCheckedChange={(checked) => 
                            setEnhancementOptions(prev => ({ ...prev, achievements: checked as boolean }))
                          }
                        />
                        <div>
                          <Label htmlFor="achievements" className="cursor-pointer">
                            Quantify Achievements
                          </Label>
                          <p className="text-sm text-gray-600">Transform duties into measurable accomplishments</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="skills"
                          checked={enhancementOptions.skills}
                          onCheckedChange={(checked) => 
                            setEnhancementOptions(prev => ({ ...prev, skills: checked as boolean }))
                          }
                        />
                        <div>
                          <Label htmlFor="skills" className="cursor-pointer">
                            Skills Enhancement
                          </Label>
                          <p className="text-sm text-gray-600">Highlight relevant technical and soft skills</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="summary"
                          checked={enhancementOptions.summary}
                          onCheckedChange={(checked) => 
                            setEnhancementOptions(prev => ({ ...prev, summary: checked as boolean }))
                          }
                        />
                        <div>
                          <Label htmlFor="summary" className="cursor-pointer">
                            Professional Summary
                          </Label>
                          <p className="text-sm text-gray-600">Create a compelling executive summary</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleEnhance}
                      className="bg-talencor-gold hover:bg-talencor-orange"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <LoadingSpinner size="sm" variant="white" className="mr-2" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          Enhance Resume
                          <Sparkles className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          )}

          {/* Step 3: Review & Download */}
          {currentStep === 3 && (
            <AnimatedCard>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Award className="h-6 w-6 text-talencor-gold" />
                    Your Enhanced Resume
                  </CardTitle>
                  <CardDescription>
                    Review your AI-enhanced resume and download when ready
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <Textarea
                      value={enhancedResume}
                      onChange={(e) => setEnhancedResume(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <Check className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Enhancement Complete!</p>
                      <p className="text-sm text-green-700">Your resume has been optimized for the {jobCategories.find(c => c.value === jobCategory)?.label} industry</p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to Options
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleDownload}
                        className="bg-talencor-gold hover:bg-talencor-orange"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          )}

          {/* Processing Animation */}
          {isProcessing && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="max-w-md mx-4">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="mb-6">
                    <LoadingSpinner size="lg" variant="primary" className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Enhancing Your Resume</h3>
                  <p className="text-gray-600 mb-4">Our AI is analyzing and optimizing your content...</p>
                  <Progress value={66} className="w-full" />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-montserrat text-navy mb-4">
              Why Use Our Resume Enhancement Wizard?
            </h2>
            <p className="text-lg text-charcoal max-w-3xl mx-auto">
              Stand out from the competition with AI-powered resume optimization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedCard>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="bg-talencor-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-talencor-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">ATS Optimization</h3>
                  <p className="text-gray-600">
                    Ensure your resume passes through Applicant Tracking Systems with proper formatting and keywords
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="bg-talencor-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-talencor-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Industry-Specific</h3>
                  <p className="text-gray-600">
                    Tailored enhancements based on your target industry's requirements and expectations
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="bg-talencor-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-talencor-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Achievement Focus</h3>
                  <p className="text-gray-600">
                    Transform your responsibilities into quantifiable achievements that impress employers
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </section>
    </>
  );
}