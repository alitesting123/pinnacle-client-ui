// src/components/QuestionModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Send } from "lucide-react";
import { ProposalItem } from "@/types/proposal";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ProposalItem;
  sectionName?: string;
  onSubmitQuestion: (question: string, itemId: string, itemName: string, sectionName: string) => Promise<void>;
}

export function QuestionModal({ 
  isOpen, 
  onClose, 
  item, 
  sectionName,
  onSubmitQuestion 
}: QuestionModalProps) {
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (question.trim() && item && sectionName && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmitQuestion(question.trim(), item.id, item.description, sectionName);
        setQuestion("");
        onClose();
      } catch (error) {
        console.error('Failed to submit question:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Ask Equipment Question
          </DialogTitle>
        </DialogHeader>

        {item && sectionName && (
          <div className="space-y-4">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-foreground">{item.description}</h4>
                <Badge variant="secondary" className="text-xs">
                  {sectionName}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Quantity: {item.quantity} • Duration: {item.duration}</p>
                <p>Price: ${item.price.toLocaleString()} each</p>
                {item.notes && (
                  <p className="italic">{item.notes}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Ask the sales</Label>
              <Textarea
                id="question"
                placeholder="Ask about specifications, alternatives, setup requirements, compatibility, or any other details about this equipment..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[120px]"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to submit • Be specific to get the best answer
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!question.trim() || isSubmitting}
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
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}