// src/components/EquipmentQuestion.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HelpCircle, Send, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { EquipmentQuestionData } from "@/types/proposal";

interface EquipmentQuestionProps {
  question: EquipmentQuestionData;
  onAnswer?: (questionId: string, answer: string) => Promise<void>;
}

export function EquipmentQuestion({ question, onAnswer }: EquipmentQuestionProps) {
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAnswer = async () => {
    if (answerText.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAnswer?.(question.id, answerText.trim());
        setAnswerText("");
        setIsAnswering(false);
      } catch (error) {
        console.error('Failed to submit answer:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getStatusIcon = () => {
    if (question.status === 'answered') {
      return <CheckCircle className="h-4 w-4 text-success" />;
    }
    return <Clock className="h-4 w-4 text-warning" />;
  };

  const getStatusBadge = () => {
    if (question.status === 'answered') {
      return <Badge className="bg-success text-success-foreground">Answered</Badge>;
    }
    return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
  };

  return (
    <Card className="border-card-border">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/50 rounded-lg mt-1">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-foreground">{question.itemName}</h4>
                <Badge variant="secondary" className="text-xs">
                  {question.sectionName}
                </Badge>
                {getStatusBadge()}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">
                    {question.askedBy.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>Asked by {question.askedBy}</span>
                <span>•</span>
                <span>{format(new Date(question.askedAt), "MMM dd, h:mm a")}</span>
              </div>
            </div>
          </div>
          {getStatusIcon()}
        </div>

        <div className="space-y-4">
          <div className="bg-secondary/30 p-4 rounded-lg">
            <p className="text-sm text-foreground leading-relaxed">{question.question}</p>
          </div>

          {question.answer && (
            <div className="bg-accent-light p-4 rounded-lg border-l-4 border-accent">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                    {question.answeredBy?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  Answered by {question.answeredBy} • {format(new Date(question.answeredAt!), "MMM dd, h:mm a")}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{question.answer}</p>
            </div>
          )}

          {question.status === 'pending' && (
            <div className="space-y-3">
              {!isAnswering ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAnswering(true)}
                  className="hover:bg-primary-light"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Answer Question
                </Button>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Provide a detailed answer about this equipment..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="min-h-[100px]"
                    disabled={isSubmitting}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSubmitAnswer}
                      disabled={!answerText.trim() || isSubmitting}
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
                          Submit Answer
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAnswering(false);
                        setAnswerText("");
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}