// src/components/ProposalDashboard.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Calendar, Lightbulb, FileText, Settings, Share2, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { ProposalHeader } from "./ProposalHeader";
import { ProposalSection } from "./ProposalSection";
import { TimelineView } from "./TimelineView";
import { QuestionsPanel } from "./QuestionsPanel";
import { SuggestionPanel } from "./SuggestionPanel";
import { QuestionModal } from "./QuestionModal";
import { SignatureModal } from "./SignatureModal";
import { ProposalData, ProposalItem, EquipmentQuestionData } from "@/types/proposal";
import { toast } from "@/hooks/use-toast";
import { Footer } from "./Footer"; // ADD THIS IMPORT

interface ProposalDashboardProps {
  proposalData: ProposalData;
}

export function ProposalDashboard({ proposalData: initialProposalData }: ProposalDashboardProps) {
  const [proposalData, setProposalData] = useState(initialProposalData);
  const [sections, setSections] = useState(proposalData.sections);
  const [questions, setQuestions] = useState<EquipmentQuestionData[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ item: ProposalItem; sectionName: string } | null>(null);
  const [signatureInfo, setSignatureInfo] = useState<{
    signature: string;
    date: string;
  } | null>(null);

  // Get proposal ID from event details
  const proposalId = proposalData.eventDetails.jobNumber || 'default';

  // Calculate total cost - handle both API response formats
  const totalCost = proposalData.pricing?.totalCost ?? proposalData.totalCost ?? 0;

  // Fetch questions from API on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      setQuestionsLoading(true);
      setQuestionsError(null);
      
      try {
        const response = await fetch(`/api/v1/proposals/${proposalId}/questions`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        setQuestionsError(error instanceof Error ? error.message : 'Failed to load questions');
        // Don't show error toast on mount - just log it
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, [proposalId]);

  const handleSectionToggle = (sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const handleItemEdit = (sectionId: string, itemId: string) => {
    toast({
      title: "Edit Item",
      description: "Item editing functionality coming soon.",
    });
  };

  const handleItemQuestion = (sectionId: string, itemId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const item = section?.items.find(i => i.id === itemId);

    if (item && section) {
      setSelectedItem({ item, sectionName: section.title });
      setIsQuestionModalOpen(true);
    }
  };

  const handleSubmitQuestion = async (question: string, itemId: string, itemName: string, sectionName: string) => {
    try {
      const response = await fetch(`/api/v1/proposals/${proposalId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: itemId,
          item_name: itemName,
          section_name: sectionName,
          question: question,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit question');
      }

      const newQuestion = await response.json();
      
      // Add new question to the list
      setQuestions(prev => [newQuestion, ...prev]);
      
      toast({
        title: "Question Submitted",
        description: `Your question about "${itemName}" has been sent to the Pinnacle Live team.`,
      });
    } catch (error) {
      console.error('Failed to submit question:', error);
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerQuestion = async (questionId: string, answer: string) => {
    try {
      const response = await fetch(`/api/v1/questions/${questionId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: answer,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const updatedQuestion = await response.json();
      
      // Update the question in the list
      setQuestions(prev => prev.map(q =>
        q.id === questionId ? updatedQuestion : q
      ));
      
      toast({
        title: "Answer Submitted",
        description: "Your answer has been sent to the client.",
      });
    } catch (error) {
      console.error('Failed to submit answer:', error);
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApplySuggestion = (suggestionId: string) => {
    toast({
      title: "Suggestion Applied",
      description: "The suggestion has been applied to your proposal.",
    });
  };

  const handleSignProposal = (signature: string, date: string) => {
    setSignatureInfo({ signature, date });
    
    // Update proposal status to confirmed
    setProposalData(prev => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        status: 'confirmed'
      }
    }));

    setIsSignatureModalOpen(false);
    
    toast({
      title: "Proposal Signed Successfully",
      description: `${signature} signed on ${new Date(date).toLocaleDateString()}. Status updated to Confirmed.`,
      duration: 5000,
    });
  };

  const expandAllSections = () => {
    setSections(prev => prev.map(section => ({ ...section, isExpanded: true })));
  };

  const collapseAllSections = () => {
    setSections(prev => prev.map(section => ({ ...section, isExpanded: false })));
  };

  const isProposalSigned = proposalData.eventDetails.status === 'confirmed' || proposalData.eventDetails.status === 'completed';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-light tracking-tight"
                  style={{
                    color: '#1a1a1a',
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}
                >
                  pinnacle
                </span>
                <div
                  className="w-0.5 h-6"
                  style={{ backgroundColor: '#B8860B' }}
                />
                <span
                  className="text-lg font-normal tracking-wider uppercase"
                  style={{
                    color: '#B8860B',
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}
                >
                  live<sup className="text-xs">™</sup>
                </span>
              </div>
              <Badge variant="secondary" className="font-medium">
                Proposal Portal
              </Badge>
              {isProposalSigned && (
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Signed
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isProposalSigned ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSignatureModalOpen(true)}
                  className="group relative border-2 border-dashed border-gray-300 hover:border-amber-400 hover:bg-amber-50/50 transition-all duration-300 px-6 py-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5 text-gray-500 group-hover:text-amber-600 transition-colors"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>

                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-700 group-hover:text-amber-800 transition-colors leading-tight">
                        Sign Proposal
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-amber-600 transition-colors">
                        Digital signature
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-6 right-6">
                    <div className="h-px bg-gray-300 group-hover:bg-amber-400 transition-colors"></div>
                    <div className="text-xs text-gray-400 group-hover:text-amber-500 transition-colors mt-1 text-center">
                      _______________
                    </div>
                  </div>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="hover:bg-secondary">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              <Button variant="outline" size="sm" className="hover:bg-secondary">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Proposal Header */}
          <ProposalHeader
            eventDetails={proposalData.eventDetails}
            totalCost={totalCost}
          />

          {/* Signature Info Display */}
          {signatureInfo && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-semibold text-success">Proposal Signed</p>
                    <p className="text-sm text-muted-foreground">
                      Signed by <span className="font-medium">{signatureInfo.signature}</span> on{' '}
                      {new Date(signatureInfo.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">
                  Status: Confirmed
                </Badge>
              </div>
            </div>
          )}

          {/* Main Tabs */}
          <Tabs defaultValue="proposal" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
              <TabsTrigger value="proposal" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Proposal Details
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="questions" className="flex items-center gap-2 relative">
                <HelpCircle className="h-4 w-4" />
                Requests
                {questions.filter(q => q.status === 'pending').length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-warning text-warning-foreground flex items-center justify-center min-w-[1.25rem]">
                    {questions.filter(q => q.status === 'pending').length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Sale's suggestion
              </TabsTrigger>
            </TabsList>

            <TabsContent value="proposal" className="space-y-6 mt-8">
              {/* Section Controls */}
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-foreground">Prososal breakdown</h3>
                  <Badge variant="secondary">
                    {sections.length} categories
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={expandAllSections}>
                    Expand All
                  </Button>
                  <Button variant="outline" size="sm" onClick={collapseAllSections}>
                    Collapse All
                  </Button>
                </div>
              </div>

              {/* Proposal Sections */}
              <div className="space-y-6">
                {sections.map((section) => (
                  <ProposalSection
                    key={section.id}
                    section={section}
                    onToggle={handleSectionToggle}
                    onItemEdit={handleItemEdit}
                    onItemQuestion={handleItemQuestion}
                  />
                ))}
              </div>

              {/* Total Summary */}
              <div className="bg-gradient-subtle p-6 rounded-lg border border-card-border shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Proposal Total</h3>
                    <p className="text-muted-foreground">
                      All equipment, labor, and services included
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-primary">
                      ${totalCost.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sections.reduce((total, section) => total + section.items.length, 0)} line items
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-8">
              <TimelineView timeline={proposalData.timeline} />
            </TabsContent>

            <TabsContent value="questions" className="mt-8">
              {questionsLoading ? (
                <Card className="border-card-border shadow-md p-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                  <p className="text-muted-foreground">Loading questions...</p>
                </Card>
              ) : questionsError ? (
                <Card className="border-card-border shadow-md p-12 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto text-destructive mb-4" />
                  <p className="text-foreground font-semibold mb-2">Failed to Load Questions</p>
                  <p className="text-muted-foreground text-sm">{questionsError}</p>
                </Card>
              ) : (
                <QuestionsPanel
                  questions={questions}
                  onAnswerQuestion={handleAnswerQuestion}
                />
              )}
            </TabsContent>

            <TabsContent value="suggestions" className="mt-8">
              <SuggestionPanel
                proposalId={proposalId}
                onApplySuggestion={handleApplySuggestion}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

    {/* ADD FOOTER HERE - AT THE END */}
    <Footer />

      {/* Question Modal */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => {
          setIsQuestionModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem?.item}
        sectionName={selectedItem?.sectionName}
        onSubmitQuestion={handleSubmitQuestion}
      />

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSign={handleSignProposal}
        proposalData={{
          jobNumber: proposalData.eventDetails.jobNumber,
          clientName: proposalData.eventDetails.clientName,
          totalCost: totalCost
        }}
      />
    </div>
  );
}