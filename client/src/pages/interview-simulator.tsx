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

interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  tips: string[];
  sampleAnswer: string;
}

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: '1',
    category: 'General',
    difficulty: 'beginner',
    question: "Tell me about yourself.",
    tips: [
      "Keep it professional and relevant to the job",
      "Structure: Present situation, past experience, future goals",
      "Limit to 2-3 minutes"
    ],
    sampleAnswer: "I'm a dedicated professional with [X years] of experience in [field]. Currently, I work as [current role] where I've successfully [key achievement]. I'm passionate about [relevant skill/interest] and I'm looking to grow my career by [future goal related to the position]."
  },
  {
    id: '2',
    category: 'Behavioral',
    difficulty: 'intermediate',
    question: "Describe a time when you had to work with a difficult team member.",
    tips: [
      "Use the STAR method (Situation, Task, Action, Result)",
      "Focus on your problem-solving approach",
      "Show emotional intelligence and professionalism"
    ],
    sampleAnswer: "In my previous role, I worked with a colleague who was often unresponsive to emails and missed deadlines. I arranged a one-on-one meeting to understand their challenges and found they were overwhelmed. I helped them prioritize tasks and established regular check-ins. This improved our collaboration and project delivery by 30%."
  },
  {
    id: '3',
    category: 'Technical',
    difficulty: 'intermediate',
    question: "How do you stay updated with industry trends and technologies?",
    tips: [
      "Show your commitment to continuous learning",
      "Mention specific resources you use",
      "Connect learning to practical application"
    ],
    sampleAnswer: "I stay current through a combination of industry publications, online courses, and professional networks. I follow key industry leaders on LinkedIn, attend monthly webinars, and dedicate time each week to learning new skills. Recently, I completed a certification in [relevant skill] which I've already applied to improve our team's workflow."
  },
  {
    id: '4',
    category: 'Situational',
    difficulty: 'advanced',
    question: "If you noticed a major error in a project that was about to be delivered to a client, what would you do?",
    tips: [
      "Show integrity and responsibility",
      "Demonstrate problem-solving skills",
      "Consider all stakeholders"
    ],
    sampleAnswer: "I would immediately assess the severity and impact of the error. First, I'd document the issue and potential solutions. Then I'd inform my supervisor and the project team immediately, presenting both the problem and proposed solutions. Even if it means delaying delivery, client trust is paramount. I'd work with the team to fix the error quickly and implement processes to prevent similar issues."
  },
  {
    id: '5',
    category: 'Career Goals',
    difficulty: 'beginner',
    question: "Where do you see yourself in 5 years?",
    tips: [
      "Align your goals with the company's growth",
      "Show ambition but be realistic",
      "Focus on skill development and contribution"
    ],
    sampleAnswer: "In five years, I see myself having grown significantly in my expertise and taking on more leadership responsibilities. I'd like to be mentoring junior team members and contributing to strategic decisions. I'm excited about the possibility of specializing in [relevant area] and helping the company achieve its long-term goals."
  }
];

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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
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

  const startInterview = () => {
    const filteredQuestions = INTERVIEW_QUESTIONS.filter(q => 
      (selectedCategory === '' || q.category.toLowerCase().includes(selectedCategory.toLowerCase())) &&
      q.difficulty === difficulty
    );
    
    if (filteredQuestions.length > 0) {
      setCurrentQuestion(filteredQuestions[0]);
      setSessionStarted(true);
      setQuestionIndex(0);
      setUserAnswer('');
      setFeedback('');
      setScore(null);
    }
  };

  const nextQuestion = () => {
    const filteredQuestions = INTERVIEW_QUESTIONS.filter(q => 
      (selectedCategory === '' || q.category.toLowerCase().includes(selectedCategory.toLowerCase())) &&
      q.difficulty === difficulty
    );
    
    const nextIndex = questionIndex + 1;
    if (nextIndex < filteredQuestions.length) {
      setCurrentQuestion(filteredQuestions[nextIndex]);
      setQuestionIndex(nextIndex);
      setUserAnswer('');
      setFeedback('');
      setScore(null);
    } else {
      // End of session
      setCurrentQuestion(null);
      setSessionStarted(false);
    }
  };

  const restartSession = () => {
    setSessionStarted(false);
    setCurrentQuestion(null);
    setUserAnswer('');
    setFeedback('');
    setScore(null);
    setQuestionIndex(0);
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

  const analyzeAnswer = () => {
    if (!userAnswer.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis (in real implementation, this would call an AI API)
    setTimeout(() => {
      const wordCount = userAnswer.trim().split(/\s+/).length;
      let analysisScore = 3; // Base score
      let analysisText = "Your answer shows good effort. ";
      
      if (wordCount > 50) {
        analysisScore += 1;
        analysisText += "Good detail and depth. ";
      }
      
      if (userAnswer.toLowerCase().includes('example') || userAnswer.toLowerCase().includes('experience')) {
        analysisScore += 1;
        analysisText += "Great use of specific examples. ";
      }
      
      if (wordCount < 20) {
        analysisScore -= 1;
        analysisText += "Consider providing more detail and examples. ";
      }
      
      analysisText += `Key areas to improve: ${currentQuestion?.tips.slice(0, 2).join(', ')}.`;
      
      setScore(Math.min(5, Math.max(1, analysisScore)));
      setFeedback(analysisText);
      setIsAnalyzing(false);
    }, 2000);
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
                        <SelectItem value="">All Categories</SelectItem>
                        {JOB_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty" className="text-sm font-semibold text-charcoal mb-2 block">
                      Difficulty Level
                    </Label>
                    <Select value={difficulty} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setDifficulty(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={startInterview} 
                    className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold"
                    disabled={INTERVIEW_QUESTIONS.filter(q => 
                      (selectedCategory === '' || q.category.toLowerCase().includes(selectedCategory.toLowerCase())) &&
                      q.difficulty === difficulty
                    ).length === 0}
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
              <p className="text-charcoal">Question {questionIndex + 1} • {difficulty} level</p>
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

          {currentQuestion && (
            <div className="space-y-6">
              {/* Question Card */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">{currentQuestion.category}</Badge>
                      <CardTitle className="text-xl font-montserrat text-navy">
                        {currentQuestion.question}
                      </CardTitle>
                    </div>
                    <Badge 
                      className={`
                        ${currentQuestion.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 
                          currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}
                      `}
                    >
                      {currentQuestion.difficulty}
                    </Badge>
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
              {(feedback || score !== null) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-montserrat text-navy flex items-center">
                      Feedback & Analysis
                      {score !== null && (
                        <div className="ml-auto flex items-center">
                          <span className="text-sm text-charcoal mr-2">Score:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={20}
                                className={star <= score ? 'text-talencor-gold fill-current' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-charcoal mb-4">{feedback}</p>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Sample Answer:</h4>
                      <p className="text-sm text-charcoal bg-gray-50 p-3 rounded border-l-4 border-talencor-gold">
                        {currentQuestion.sampleAnswer}
                      </p>
                    </div>
                    
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
                        className="bg-talencor-gold hover:bg-talencor-orange text-white"
                      >
                        Next Question
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