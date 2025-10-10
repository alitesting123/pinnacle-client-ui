// src/components/QuestionsPanel.tsx - UPDATED VERSION
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, MessageSquare, Clock, CheckCircle, Send, Plus, X } from "lucide-react";
import { EquipmentQuestion } from "./EquipmentQuestion";
import { EquipmentQuestionData } from "@/types/proposal";

interface QuestionsPanelProps {
  questions: EquipmentQuestionData[];
  onAnswerQuestion: (questionId: string, answer: string) => Promise<void>;
  onAskGeneralQuestion: (question: string, subject: string) => Promise<void>;
}

export function QuestionsPanel({ questions, onAnswerQuestion, onAskGeneralQuestion }: QuestionsPanelProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredQuestions = questions.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  const pendingCount = questions.filter(q => q.status === 'pending').length;
  const answeredCount = questions.filter(q => q.status === 'answered').length;

  const handleAnswerQuestion = async (questionId: string, answer: string) => {
    await onAnswerQuestion(questionId, answer);
  };

  const handleSubmitGeneralQuestion = async () => {
    if (question.trim() && subject.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAskGeneralQuestion(question.trim(), subject.trim());
        setQuestion("");
        setSubject("");
        setShowQuestionForm(false);
      } catch (error) {
        console.error('Failed to submit question:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const quickTopics = [
    "Timeline & Scheduling",
    "Payment & Pricing",
    "Delivery & Setup",
    "Technical Support",
    "Cancellation Policy",
    "Additional Services"
  ];

  // Separate equipment questions from general questions
  const equipmentQuestions = filteredQuestions.filter(q => q.itemId && q.itemId !== 'general');
  const generalQuestions = filteredQuestions.filter(q => !q.itemId || q.itemId === 'general');

  const groupedQuestions = equipmentQuestions.reduce((acc, question) => {
    const section = question.sectionName;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(question);
    return acc;
  }, {} as Record<string, EquipmentQuestionData[]>);

  return (
    <Card className="border-card-border shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-light rounded-lg">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Questions & Requests</h2>
              <p className="text-sm text-muted-foreground">
                Ask about equipment, pricing, timeline, or general inquiries
              </p>
            </div>
          </div>
          
          {!showQuestionForm && (
            <Button 
              onClick={() => setShowQuestionForm(true)}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          )}
        </div>

        {/* Inline Question Form */}
        {showQuestionForm && (
          <Card className="mb-6 border-primary/20 bg-primary-light/30">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Ask a General Question
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowQuestionForm(false);
                    setSubject("");
                    setQuestion("");
                  }}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject / Topic *
                  </Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Timeline flexibility, Payment options, Additional equipment"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isSubmitting}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Quick Topics:</Label>
                  <div className="flex flex-wrap gap-2">
                    {quickTopics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary-hover text-xs"
                        onClick={() => setSubject(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question" className="text-sm font-medium">
                    Your Question *
                  </Label>
                  <Textarea
                    id="question"
                    placeholder="Ask about scheduling, pricing details, equipment alternatives, logistics, or anything else..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[100px] bg-background"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowQuestionForm(false);
                      setSubject("");
                      setQuestion("");
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitGeneralQuestion}
                    disabled={!question.trim() || !subject.trim() || isSubmitting}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Question
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              All ({questions.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="answered" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Answered ({answeredCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            {filteredQuestions.length > 0 ? (
              <div className="space-y-6">
                {/* General Questions Section */}
                {generalQuestions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">General</h3>
                      <Badge variant="secondary" className="text-xs">
                        {generalQuestions.length} questions
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {generalQuestions.map((question) => (
                        <EquipmentQuestion
                          key={question.id}
                          question={question}
                          onAnswer={handleAnswerQuestion}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment Questions by Section */}
                {Object.entries(groupedQuestions).map(([sectionName, sectionQuestions]) => (
                  <div key={sectionName}>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-foreground">{sectionName}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {sectionQuestions.length} questions
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {sectionQuestions.map((question) => (
                        <EquipmentQuestion
                          key={question.id}
                          question={question}
                          onAnswer={handleAnswerQuestion}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-4 bg-secondary/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {filter === 'pending' ? (
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  ) : filter === 'answered' ? (
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <HelpCircle className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {filter === 'pending' ? 'No Pending Questions' : 
                   filter === 'answered' ? 'No Answered Questions' : 
                   'No Questions Yet'}
                </h3>
                <p className="text-muted-foreground">
                  {filter === 'pending' 
                    ? "All questions have been answered! Great job staying on top of client inquiries."
                    : filter === 'answered'
                    ? "No questions have been answered yet. Check the pending tab."
                    : "Click 'Ask Question' above to start a conversation with the sales team."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {pendingCount > 0 && (
          <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              <span className="font-medium text-foreground">
                {pendingCount} question{pendingCount !== 1 ? 's' : ''} awaiting response
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Quick responses help build client confidence and move proposals forward faster.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}