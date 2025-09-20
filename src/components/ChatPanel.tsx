import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageCircle, HelpCircle, Lightbulb, X } from "lucide-react";
import { ChatMessage } from "@/types/proposal";
import { format } from "date-fns";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

export function ChatPanel({ isOpen, onClose, initialQuestion }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Pinnacle Live Team',
      message: 'Hello! I\'m here to help you with your event proposal. Feel free to ask any questions about equipment, pricing, or logistics.',
      timestamp: new Date().toISOString(),
      type: 'message'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (initialQuestion) {
      setNewMessage(initialQuestion);
    }
  }, [messages, initialQuestion]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        type: 'message'
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsTyping(true);

      // Simulate response
      setTimeout(() => {
        const responses = [
          "Thanks for your question! Let me look into that for you.",
          "That's a great point. Based on your event size, I'd recommend...",
          "I can help optimize that section. Would you like me to suggest some alternatives?",
          "Let me check our inventory and get back to you with pricing options.",
        ];
        
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'Shahar Zlochover',
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toISOString(),
          type: 'message'
        };

        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getMessageIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-warning" />;
      case 'question':
        return <HelpCircle className="h-4 w-4 text-primary" />;
      default:
        return <MessageCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed right-6 top-24 bottom-6 w-96 border-card-border shadow-elegant z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-card-border bg-gradient-subtle">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-light rounded-full">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Pinnacle Live Support</h3>
            <p className="text-xs text-muted-foreground">Ask questions about your proposal</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-secondary">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'You' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {message.sender !== 'You' && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {message.sender.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {message.sender} • {format(new Date(message.timestamp), 'h:mm a')}
                  </span>
                  {getMessageIcon(message.type)}
                </div>
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.sender === 'You'
                      ? 'bg-chat-sent text-primary-foreground'
                      : 'bg-chat-received text-foreground border border-chat-border'
                  }`}
                >
                  {message.message}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 p-3 bg-chat-received rounded-lg border border-chat-border">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-muted-foreground">Pinnacle Live is typing...</span>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="p-4 border-t border-card-border bg-chat-bg">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about equipment, pricing, alternatives..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary-hover text-xs"
            onClick={() => setNewMessage("Can you suggest alternatives for the lighting setup?")}
          >
            💡 Lighting alternatives
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary-hover text-xs"
            onClick={() => setNewMessage("How can we optimize costs for this event?")}
          >
            💰 Cost optimization
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary-hover text-xs"
            onClick={() => setNewMessage("What's included in the labor costs?")}
          >
            👷 Labor details
          </Badge>
        </div>
      </div>
    </Card>
  );
}