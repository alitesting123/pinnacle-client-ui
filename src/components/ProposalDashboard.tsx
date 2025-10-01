// src/components/ProposalDashboard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Calendar, Lightbulb, FileText, Settings, Share2, CheckCircle } from "lucide-react";
import { ProposalHeader } from "./ProposalHeader";
import { ProposalSection } from "./ProposalSection";
import { TimelineView } from "./TimelineView";
import { QuestionsPanel } from "./QuestionsPanel";
import { SuggestionPanel } from "./SuggestionPanel";
import { QuestionModal } from "./QuestionModal";
import { SignatureModal } from "./SignatureModal";
import { ProposalData, ProposalItem } from "@/types/proposal";
import { EquipmentQuestionData } from "./EquipmentQuestion";
import { mockQuestions } from "@/data/mockQuestions";
import { toast } from "@/hooks/use-toast";

interface ProposalDashboardProps {
  proposalData: ProposalData;
}

export function ProposalDashboard({ proposalData: initialProposalData }: ProposalDashboardProps) {
  const [proposalData, setProposalData] = useState(initialProposalData);
  const [sections, setSections] = useState(proposalData.sections);
  const [questions, setQuestions] = useState<EquipmentQuestionData[]>(mockQuestions);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ item: ProposalItem; sectionName: string } | null>(null);
  const [signatureInfo, setSignatureInfo] = useState<{
    signature: string;
    date: string;
  } | null>(null);

  // Get proposal ID from event details
  const proposalId = proposalData.eventDetails.jobNumber || 'default';

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

  const handleSubmitQuestion = (question: string, itemId: string, itemName: string, sectionName: string) => {
    const newQuestion: EquipmentQuestionData = {
      id: `q${Date.now()}`,
      itemId,
      itemName,
      sectionName,
      question,
      status: 'pending',
      askedBy: 'You',
      askedAt: new Date().toISOString()
    };

    setQuestions(prev => [newQuestion, ...prev]);
    toast({
      title: "Question Submitted",
      description: `Your question about "${itemName}" has been sent to the Pinnacle Live team.`,
    });
  };

  const handleAnswerQuestion = (questionId: string, answer: string) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId
        ? {
          ...q,
          answer,
          status: 'answered' as const,
          answeredBy: 'Shahar Zlochover',
          answeredAt: new Date().toISOString()
        }
        : q
    ));
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
            totalCost={proposalData.totalCost}
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
                  <h3 className="font-semibold text-foreground">Equipment Sections</h3>
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
                      ${proposalData.totalCost.toLocaleString()}
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
              <QuestionsPanel
                questions={questions}
                onAnswerQuestion={handleAnswerQuestion}
              />
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
          totalCost: proposalData.totalCost
        }}
      />
    </div>
  );
}