import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, MessageSquare, Clock, CheckCircle, Filter } from "lucide-react";
import { EquipmentQuestion, EquipmentQuestionData } from "./EquipmentQuestion";
import { toast } from "@/hooks/use-toast";

interface QuestionsPanelProps {
  questions: EquipmentQuestionData[];
  onReplyToQuestion: (questionId: string, reply: string) => void;
}

export function QuestionsPanel({ questions, onReplyToQuestion }: QuestionsPanelProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all');

  const filteredQuestions = questions.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  const pendingCount = questions.filter(q => q.status === 'pending').length;
  const answeredCount = questions.filter(q => q.status === 'answered').length;

  const handleReplyToQuestion = (questionId: string, reply: string) => {
    onReplyToQuestion(questionId, reply);
    toast({
      title: "Reply Sent",
      description: "Your reply has been added to the conversation.",
    });
  };

  const groupedQuestions = filteredQuestions.reduce((acc, question) => {
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
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-light rounded-lg">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Equipment Q&A</h2>
            <p className="text-sm text-muted-foreground">
              Client questions and team responses about specific equipment
            </p>
          </div>
        </div>

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
                {Object.entries(groupedQuestions).map(([sectionName, sectionQuestions]) => (
                  <div key={sectionName}>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-foreground">{sectionName}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {sectionQuestions.length} conversation{sectionQuestions.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {sectionQuestions.map((question) => (
                        <EquipmentQuestion
                          key={question.id}
                          question={question}
                          onReply={handleReplyToQuestion}
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
                    : "Clients can ask questions about specific equipment items in the proposal."}
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