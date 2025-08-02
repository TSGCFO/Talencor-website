import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, Play, Pause, RotateCcw, CheckCircle, AlertCircle, Clock, Star } from "lucide-react";
import { Link } from "wouter";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/micro-interactions";
import { useToast } from "@/hooks/use-toast";

interface InterviewQuestion {
  question: string;
  tips: string[];
  expectedElements: string[];
}

interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  overallFeedback: string;
}

// Removed hardcoded questions - using dynamic AI-generated questions instead

const JOB_CATEGORIES = [
  'Administrative',
  'Customer Service',
  'Healthcare',
  'Information Technology',
  'Manufacturing',
  'Finance & Accounting',
  'Sales & Marketing',
  'Engineering'
];

export default function InterviewSimulator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [experienceLevel, setExperienceLevel] = useState<string>('mid');
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const { toast } = useToast();
  
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  const startInterview = async () => {
    setSessionStarted(true);
    setIsGeneratingQuestion(true);
    setPreviousQuestions([]);
    setQuestionNumber(1);
    
    try {
      const response = await fetch("/api/interview/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobCategory: selectedCategory,
          experienceLevel: experienceLevel,
          questionNumber: 1,
          previousQuestions: []
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to generate question");
      }

      setCurrentQuestion({
        question: data.question,
        tips: data.tips,
        expectedElements: data.expectedElements
      });
      setPreviousQuestions([data.question]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start interview",
        variant: "destructive",
      });
      setSessionStarted(false);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const nextQuestion = async () => {
    if (questionNumber >= 10) {
      toast({
        title: "Interview Complete",
        description: "You've completed 10 questions. Great job!",
      });
      setSessionStarted(false);
      return;
    }

    setIsGeneratingQuestion(true);
    setUserAnswer('');
    setFeedback(null);
    setRecordingTime(0);
    setIsRecording(false);
    
    try {
      const response = await fetch("/api/interview/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobCategory: selectedCategory,
          experienceLevel: experienceLevel,
          questionNumber: questionNumber + 1,
          previousQuestions: previousQuestions
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to generate question");
      }

      setCurrentQuestion({
        question: data.question,
        tips: data.tips,
        expectedElements: data.expectedElements
      });
      setPreviousQuestions([...previousQuestions, data.question]);
      setQuestionNumber(questionNumber + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate next question",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const restartSession = () => {
    setSessionStarted(false);
    setCurrentQuestion(null);
    setUserAnswer('');
    setFeedback(null);
    setQuestionNumber(1);
    setPreviousQuestions([]);
    setRecordingTime(0);
    setIsRecording(false);
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        
        mediaRecorder.current.ondataavailable = (event) => {
          // In a real implementation, you would send this audio data to a speech-to-text service
          console.log('Audio data available:', event.data);
        };
        
        mediaRecorder.current.start();
        setIsRecording(true);
        setRecordingTime(0);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Could not access microphone. Please check your browser permissions.');
      }
    } else {
      if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
        mediaRecorder.current.stop();
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
    }
  };

  const analyzeAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch("/api/interview/evaluate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          response: userAnswer,
          jobCategory: selectedCategory,
          experienceLevel: experienceLevel
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to evaluate response");
      }

      setFeedback(data.feedback);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze answer",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!sessionStarted) {
    return (
      <>
        <Helmet>
          <title>Interview Preparation Simulator | Talencor Staffing</title>
          <meta 
            name="description" 
            content="Practice and perfect your interview skills with our AI-powered interview simulator. Get personalized feedback and improve your chances of landing your dream job." 
          />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-light-grey to-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
                Interview Preparation <span className="text-talencor-gold">Simulator</span>
              </h1>
              <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
                Practice common interview questions, get AI-powered feedback, and build confidence for your next interview
              </p>
            </div>

            {/* Setup Form */}
            <AnimatedCard className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-montserrat text-navy">Customize Your Practice Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category" className="text-sm font-semibold text-charcoal mb-2 block">
                      Job Category (Optional)
                    </Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category or leave blank for general questions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {JOB_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experience" className="text-sm font-semibold text-charcoal mb-2 block">
                      Experience Level
                    </Label>
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                        <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
                        <SelectItem value="executive">Executive/Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={startInterview} 
                    className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold"
                  >
                    <Play className="mr-2" size={20} />
                    Start Interview Practice
                  </Button>
                </div>
              </CardContent>
            </AnimatedCard>

            {/* Features Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: <Mic className="text-talencor-gold" size={32} />,
                  title: "Voice Recording",
                  description: "Practice speaking your answers aloud to improve your delivery and confidence"
                },
                {
                  icon: <Star className="text-talencor-orange" size={32} />,
                  title: "AI Feedback",
                  description: "Get personalized feedback on your answers with tips for improvement"
                },
                {
                  icon: <CheckCircle className="text-navy" size={32} />,
                  title: "Professional Tips",
                  description: "Learn from expert advice and sample answers for common interview questions"
                }
              ].map((feature, index) => (
                <AnimatedCard key={index} delay={index * 100}>
                  <CardContent className="text-center p-6">
                    <div className="mb-4 flex justify-center">{feature.icon}</div>
                    <h3 className="text-lg font-semibold font-montserrat text-navy mb-2">{feature.title}</h3>
                    <p className="text-charcoal text-sm">{feature.description}</p>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <p className="text-charcoal mb-4">Need personalized interview coaching?</p>
              <Link href="/contact">
                <Button variant="outline" className="border-talencor-gold text-talencor-gold hover:bg-talencor-gold hover:text-white">
                  Contact Our Career Specialists
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Interview Practice Session | Talencor Staffing</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-light-grey to-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Session Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold font-montserrat text-navy">Interview Practice Session</h1>
              <p className="text-charcoal">Question {questionNumber} of 10 • {experienceLevel === 'entry' ? 'Entry' : experienceLevel === 'mid' ? 'Mid' : experienceLevel === 'senior' ? 'Senior' : 'Executive'} Level</p>
            </div>
            <Button 
              onClick={restartSession} 
              variant="outline" 
              className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
            >
              <RotateCcw size={16} className="mr-2" />
              Restart
            </Button>
          </div>

          {isGeneratingQuestion ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" className="text-talencor-gold" />
              <span className="ml-3 text-charcoal">Generating your interview question...</span>
            </div>
          ) : currentQuestion && (
            <div className="space-y-6">
              {/* Question Card */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">{selectedCategory}</Badge>
                      <CardTitle className="text-xl font-montserrat text-navy">
                        {currentQuestion.question}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold text-charcoal mb-2">💡 Tips for answering:</h4>
                    <ul className="list-disc list-inside text-sm text-charcoal space-y-1">
                      {currentQuestion.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Recording Controls */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={toggleRecording}
                        className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-talencor-gold hover:bg-talencor-orange'} text-white`}
                      >
                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                        <span className="ml-2">
                          {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </span>
                      </Button>
                      
                      {isRecording && (
                        <div className="flex items-center text-red-500">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                          <span className="font-mono">{formatTime(recordingTime)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-charcoal">
                      <Clock size={16} className="inline mr-1" />
                      Recommended: 2-3 minutes
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Answer Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-montserrat text-navy">Your Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here, or use voice recording above..."
                    className="min-h-32 mb-4"
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-charcoal">
                      {userAnswer.trim().split(/\s+/).filter(word => word.length > 0).length} words
                    </div>
                    
                    <Button 
                      onClick={analyzeAnswer}
                      disabled={!userAnswer.trim() || isAnalyzing}
                      className="bg-navy hover:bg-charcoal text-white"
                    >
                      {isAnalyzing ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Answer'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback */}
              {feedback && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-montserrat text-navy flex items-center">
                      AI Feedback & Analysis
                      <div className="ml-auto flex items-center">
                        <span className="text-sm text-charcoal mr-2">Score:</span>
                        <Badge className="bg-talencor-gold text-white">
                          {feedback.score}/100
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Overall Feedback */}
                    <div>
                      <p className="text-charcoal">{feedback.overallFeedback}</p>
                    </div>

                    <Separator />

                    {/* Strengths */}
                    {feedback.strengths.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-navy mb-2 flex items-center">
                          <CheckCircle size={16} className="mr-2 text-green-600" />
                          Strengths
                        </h4>
                        <ul className="list-disc list-inside text-sm text-charcoal space-y-1 ml-6">
                          {feedback.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Areas for Improvement */}
                    {feedback.improvements.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-navy mb-2 flex items-center">
                          <AlertCircle size={16} className="mr-2 text-talencor-orange" />
                          Areas for Improvement
                        </h4>
                        <ul className="list-disc list-inside text-sm text-charcoal space-y-1 ml-6">
                          {feedback.improvements.map((improvement, index) => (
                            <li key={index}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {feedback.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-navy mb-2">💡 Suggestions for Next Time</h4>
                        <ul className="list-disc list-inside text-sm text-charcoal space-y-1 ml-6">
                          {feedback.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Expected Elements */}
                    {currentQuestion && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-charcoal mb-2">Key Elements to Include:</h4>
                        <ul className="list-check list-inside text-sm text-charcoal space-y-1">
                          {currentQuestion.expectedElements.map((element, index) => (
                            <li key={index}>✓ {element}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-6">
                      <Button 
                        onClick={restartSession}
                        variant="outline"
                        className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                      >
                        End Session
                      </Button>
                      
                      <Button 
                        onClick={nextQuestion}
                        disabled={isGeneratingQuestion}
                        className="bg-talencor-gold hover:bg-talencor-orange text-white"
                      >
                        {isGeneratingQuestion ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Generating...
                          </>
                        ) : (
                          'Next Question'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}