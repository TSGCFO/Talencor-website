import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Heart, 
  Tag, 
  BookOpen, 
  Star,
  Settings,
  Download,
  Upload,
  Copy,
  Eye
} from "lucide-react";
import { Link } from "wouter";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/micro-interactions";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface QuestionCategory {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  _count?: {
    questions: number;
  };
}

interface QuestionTag {
  id: number;
  name: string;
  color: string;
  createdAt: string;
}

interface CustomInterviewQuestion {
  id: number;
  categoryId?: number;
  question: string;
  difficulty: 'entry' | 'mid' | 'senior' | 'executive';
  tips: string[];
  expectedElements: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  category?: QuestionCategory;
  tags?: QuestionTag[];
  isFavorited?: boolean;
}

const DIFFICULTY_COLORS = {
  entry: 'bg-green-100 text-green-800',
  mid: 'bg-blue-100 text-blue-800',
  senior: 'bg-orange-100 text-orange-800',
  executive: 'bg-purple-100 text-purple-800',
};

const DIFFICULTY_LABELS = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
  executive: 'Executive',
};

export default function QuestionBank() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<CustomInterviewQuestion | null>(null);
  const [activeTab, setActiveTab] = useState('browse');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for creating/editing questions
  const [formData, setFormData] = useState({
    categoryId: '',
    question: '',
    difficulty: 'mid' as const,
    tips: [''],
    expectedElements: [''],
    isPublic: false,
    tagIds: [] as number[],
  });

  // Fetch questions
  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ['/api/question-bank/questions', { 
      search: searchQuery, 
      category: selectedCategory,
      difficulty: selectedDifficulty,
      tags: selectedTags,
      favoritesOnly: showFavoritesOnly 
    }],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchQuery,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        favoritesOnly: showFavoritesOnly.toString(),
      });
      
      selectedTags.forEach(tag => params.append('tags', tag.toString()));
      
      const response = await fetch(`/api/question-bank/questions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      return response.json();
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/question-bank/categories'],
    queryFn: async () => {
      const response = await fetch('/api/question-bank/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ['/api/question-bank/tags'],
    queryFn: async () => {
      const response = await fetch('/api/question-bank/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      return response.json();
    },
  });

  // Create question mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (questionData: any) => {
      const response = await fetch('/api/question-bank/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      });
      if (!response.ok) throw new Error('Failed to create question');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/question-bank/questions'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({ title: 'Success', description: 'Question created successfully!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to create question',
        variant: 'destructive' 
      });
    },
  });

  // Update question mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, ...questionData }: any) => {
      const response = await fetch(`/api/question-bank/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      });
      if (!response.ok) throw new Error('Failed to update question');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/question-bank/questions'] });
      setEditingQuestion(null);
      resetForm();
      toast({ title: 'Success', description: 'Question updated successfully!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to update question',
        variant: 'destructive' 
      });
    },
  });

  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/question-bank/questions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete question');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/question-bank/questions'] });
      toast({ title: 'Success', description: 'Question deleted successfully!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to delete question',
        variant: 'destructive' 
      });
    },
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (questionId: number) => {
      const response = await fetch(`/api/question-bank/questions/${questionId}/favorite`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to toggle favorite');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/question-bank/questions'] });
    },
  });

  const resetForm = () => {
    setFormData({
      categoryId: '',
      question: '',
      difficulty: 'mid',
      tips: [''],
      expectedElements: [''],
      isPublic: false,
      tagIds: [],
    });
  };

  const handleEdit = (question: CustomInterviewQuestion) => {
    setEditingQuestion(question);
    setFormData({
      categoryId: question.categoryId?.toString() || '',
      question: question.question,
      difficulty: question.difficulty,
      tips: question.tips,
      expectedElements: question.expectedElements,
      isPublic: question.isPublic,
      tagIds: question.tags?.map(tag => tag.id) || [],
    });
    setIsCreateDialogOpen(true);
  };

  const handleSubmit = () => {
    const questionData = {
      ...formData,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      tips: formData.tips.filter(tip => tip.trim()),
      expectedElements: formData.expectedElements.filter(element => element.trim()),
    };

    if (editingQuestion) {
      updateQuestionMutation.mutate({ id: editingQuestion.id, ...questionData });
    } else {
      createQuestionMutation.mutate(questionData);
    }
  };

  const addTipField = () => {
    setFormData({ ...formData, tips: [...formData.tips, ''] });
  };

  const addElementField = () => {
    setFormData({ ...formData, expectedElements: [...formData.expectedElements, ''] });
  };

  const removeTipField = (index: number) => {
    const newTips = formData.tips.filter((_, i) => i !== index);
    setFormData({ ...formData, tips: newTips });
  };

  const removeElementField = (index: number) => {
    const newElements = formData.expectedElements.filter((_, i) => i !== index);
    setFormData({ ...formData, expectedElements: newElements });
  };

  const updateTip = (index: number, value: string) => {
    const newTips = [...formData.tips];
    newTips[index] = value;
    setFormData({ ...formData, tips: newTips });
  };

  const updateElement = (index: number, value: string) => {
    const newElements = [...formData.expectedElements];
    newElements[index] = value;
    setFormData({ ...formData, expectedElements: newElements });
  };

  const filteredQuestions = questions.filter((question: CustomInterviewQuestion) => {
    if (searchQuery && !question.question.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && question.categoryId?.toString() !== selectedCategory) {
      return false;
    }
    if (selectedDifficulty !== 'all' && question.difficulty !== selectedDifficulty) {
      return false;
    }
    if (selectedTags.length > 0) {
      const questionTagIds = question.tags?.map(tag => tag.id) || [];
      if (!selectedTags.every(tagId => questionTagIds.includes(tagId))) {
        return false;
      }
    }
    if (showFavoritesOnly && !question.isFavorited) {
      return false;
    }
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Question Bank | Talencor Staffing</title>
        <meta 
          name="description" 
          content="Create, organize, and manage your custom interview questions. Build your personalized question bank for interview preparation." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-light-grey to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Interview Question <span className="text-talencor-gold">Bank</span>
            </h1>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Create, organize, and manage your custom interview questions for better preparation
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browse">Browse Questions</TabsTrigger>
              <TabsTrigger value="create">Create Question</TabsTrigger>
              <TabsTrigger value="manage">Manage Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Search and Filter Bar */}
              <AnimatedCard>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search questions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category: QuestionCategory) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="entry">Entry</SelectItem>
                          <SelectItem value="mid">Mid</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant={showFavoritesOnly ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className="whitespace-nowrap"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Favorites
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>

              {/* Questions Grid */}
              {questionsLoading ? (
                <div className="flex justify-center py-20">
                  <LoadingSpinner size="lg" className="text-talencor-gold" />
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredQuestions.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-20">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-charcoal mb-2">No Questions Found</h3>
                        <p className="text-gray-600 mb-4">
                          {searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedTags.length > 0 || showFavoritesOnly
                            ? "Try adjusting your filters to see more questions."
                            : "Start building your question bank by creating your first question."}
                        </p>
                        <Button 
                          onClick={() => setActiveTab('create')}
                          className="bg-talencor-gold hover:bg-talencor-orange text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Question
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredQuestions.map((question: CustomInterviewQuestion) => (
                      <AnimatedCard key={question.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {question.category && (
                                  <Badge variant="secondary">{question.category.name}</Badge>
                                )}
                                <Badge className={DIFFICULTY_COLORS[question.difficulty]}>
                                  {DIFFICULTY_LABELS[question.difficulty]}
                                </Badge>
                                {question.isPublic && (
                                  <Badge variant="outline">Public</Badge>
                                )}
                              </div>
                              
                              <h3 className="text-lg font-semibold text-navy mb-3">
                                {question.question}
                              </h3>

                              {question.tags && question.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {question.tags.map((tag) => (
                                    <Badge 
                                      key={tag.id} 
                                      variant="outline" 
                                      style={{ borderColor: tag.color }}
                                      className="text-xs"
                                    >
                                      <Tag className="h-3 w-3 mr-1" />
                                      {tag.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <h4 className="font-medium text-charcoal mb-1">Tips:</h4>
                                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {question.tips.slice(0, 2).map((tip, index) => (
                                      <li key={index}>{tip}</li>
                                    ))}
                                    {question.tips.length > 2 && (
                                      <li className="text-talencor-gold">+{question.tips.length - 2} more...</li>
                                    )}
                                  </ul>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-charcoal mb-1">Key Elements:</h4>
                                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {question.expectedElements.slice(0, 2).map((element, index) => (
                                      <li key={index}>{element}</li>
                                    ))}
                                    {question.expectedElements.length > 2 && (
                                      <li className="text-talencor-gold">+{question.expectedElements.length - 2} more...</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavoriteMutation.mutate(question.id)}
                              >
                                <Heart 
                                className={`h-4 w-4 ${question.isFavorited ? 'text-red-500 fill-red-500' : ''}`} 
                              />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(question)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Question</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this question? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteQuestionMutation.mutate(question.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </AnimatedCard>
                    ))
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <AnimatedCard>
                <CardHeader>
                  <CardTitle className="text-2xl font-montserrat text-navy">
                    {editingQuestion ? 'Edit Question' : 'Create New Question'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.categoryId} 
                        onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: QuestionCategory) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select 
                        value={formData.difficulty} 
                        onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      placeholder="Enter your interview question..."
                      className="min-h-20"
                    />
                  </div>

                  <div>
                    <Label>Tips for Answering</Label>
                    <div className="space-y-2">
                      {formData.tips.map((tip, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={tip}
                            onChange={(e) => updateTip(index, e.target.value)}
                            placeholder={`Tip ${index + 1}...`}
                          />
                          {formData.tips.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTipField(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTipField}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tip
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Expected Elements in Answer</Label>
                    <div className="space-y-2">
                      {formData.expectedElements.map((element, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={element}
                            onChange={(e) => updateElement(index, e.target.value)}
                            placeholder={`Key element ${index + 1}...`}
                          />
                          {formData.expectedElements.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeElementField(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addElementField}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Element
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="isPublic">Make this question public</Label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    {editingQuestion && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingQuestion(null);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      onClick={handleSubmit}
                      disabled={!formData.question.trim() || createQuestionMutation.isPending || updateQuestionMutation.isPending}
                      className="bg-talencor-gold hover:bg-talencor-orange text-white"
                    >
                      {createQuestionMutation.isPending || updateQuestionMutation.isPending ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          {editingQuestion ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        editingQuestion ? 'Update Question' : 'Create Question'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </AnimatedCard>
            </TabsContent>

            <TabsContent value="manage" className="space-y-6">
              <AnimatedCard>
                <CardHeader>
                  <CardTitle className="text-2xl font-montserrat text-navy">Manage Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {categories.map((category: QuestionCategory) => (
                      <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-navy">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-600">{category.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {category._count?.questions || 0} questions
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AnimatedCard>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <div className="flex justify-center gap-4">
              <Link href="/interview-simulator">
                <Button variant="outline" className="border-talencor-gold text-talencor-gold hover:bg-talencor-gold hover:text-white">
                  Practice with AI Simulator
                </Button>
              </Link>
              <Link href="/resume-wizard">
                <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                  Enhance Your Resume
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}