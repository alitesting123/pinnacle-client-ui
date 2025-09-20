import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { QuestionReply } from "@/types/proposal";

export interface EquipmentQuestionData {
  id: string;
  itemId: string;
  itemName: string;
  sectionName: string;
  question: string;
  replies?: QuestionReply[];
  status: 'pending' | 'answered';
  askedBy: string;
  askedAt: string;
}

interface EquipmentQuestionProps {
  question: EquipmentQuestionData;
  onReply?: (questionId: string, reply: string) => void;
}

export function EquipmentQuestion({ question, onReply }: EquipmentQuestionProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply?.(question.id, replyText.trim());
      setReplyText("");
      setIsReplying(false);
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
            </div>
          </div>
          {getStatusIcon()}
        </div>

        {/* Original Question */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                {question.askedBy.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-foreground">{question.askedBy}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(question.askedAt), "MMM dd, h:mm a")}
                </span>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">{question.question}</p>
              </div>
            </div>
          </div>

          {/* Replies Thread */}
          {question.replies && question.replies.length > 0 && (
            <div className="ml-11 space-y-3 border-l-2 border-muted pl-4">
              {question.replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className={`text-xs ${reply.isFromTeam ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      {reply.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground">{reply.author}</span>
                      {reply.isFromTeam && (
                        <Badge variant="outline" className="text-xs">Team</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(reply.timestamp), "MMM dd, h:mm a")}
                      </span>
                    </div>
                    <div className={`p-3 rounded-lg ${reply.isFromTeam ? 'bg-accent-light border border-accent/20' : 'bg-secondary/30'}`}>
                      <p className="text-sm text-foreground leading-relaxed">{reply.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Input */}
          <div className="ml-11 space-y-3">
            {!isReplying ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(true)}
                className="text-primary hover:bg-primary-light"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Reply
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      Y
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                <div className="flex gap-2 ml-10">
                  <Button
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={!replyText.trim()}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyText("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}