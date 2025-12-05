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
import { ConfirmationModal } from "./ConfirmationModal";
import { ProposalData, ProposalItem, ProposalSection as ProposalSectionType, EquipmentQuestionData, Suggestion } from "@/types/proposal";
import { toast } from "@/hooks/use-toast";
import { Footer } from "./Footer";
import { apiService } from "@/services/api";

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
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ item: ProposalItem; sectionName: string } | null>(null);
  const [confirmationInfo, setConfirmationInfo] = useState<{
    confirmedBy: string;
    date: string;
  } | null>(null);
  const [addedSuggestions, setAddedSuggestions] = useState<string[]>([]);

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
        const questions = await apiService.getProposalQuestions(proposalId);
        setQuestions(questions);
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

  const handleItemRemove = (sectionId: string, itemId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const item = section?.items.find(i => i.id === itemId);
    
    if (!item || !section) return;

    // Only allow removal from Additional Services section
    if (section.title !== 'Additional Services') {
      toast({
        title: "Cannot Remove",
        description: "Only items from Additional Services can be removed.",
        variant: "destructive",
      });
      return;
    }

    // Remove from added suggestions tracking
    setAddedSuggestions(prev => prev.filter(id => id !== itemId));

    // Update total cost - subtract the item price
    setProposalData(prev => ({
      ...prev,
      totalCost: (prev.totalCost || 0) - item.price,
      pricing: {
        totalCost: (prev.pricing?.totalCost || prev.totalCost || 0) - item.price
      }
    }));

    // Remove item from section
    setSections(prev => {
      const updatedSections = prev.map(s => {
        if (s.id === sectionId) {
          const updatedItems = s.items.filter(i => i.id !== itemId);
          return {
            ...s,
            items: updatedItems,
            total: s.total - item.price
          };
        }
        return s;
      });

      // If Additional Services section is now empty, remove it
      return updatedSections.filter(s => 
        s.title !== 'Additional Services' || s.items.length > 0
      );
    });

    toast({
      title: "Item Removed",
      description: `${item.description} has been removed from your proposal. Total reduced by $${item.price.toLocaleString()}.`,
    });
  };

  const handleSubmitQuestion = async (question: string, itemId: string, itemName: string, sectionName: string) => {
    try {
      const newQuestion = await apiService.createProposalQuestion(proposalId, {
        item_id: itemId,
        item_name: itemName,
        section_name: sectionName,
        question: question,
      });

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
  
  const handleAskGeneralQuestion = async (question: string, subject: string) => {
    try {
      const newQuestion = await apiService.createProposalQuestion(proposalId, {
        item_id: 'general',
        item_name: subject,
        section_name: 'General',
        question: question,
      });

      // Add new question to the list
      setQuestions(prev => [newQuestion, ...prev]);

      toast({
        title: "Question Submitted",
        description: `Your question about "${subject}" has been sent to the Pinnacle Live team.`,
      });
    } catch (error) {
      console.error('Failed to submit general question:', error);
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerQuestion = async (questionId: string, answer: string) => {
    try {
      const updatedQuestion = await apiService.answerQuestion(questionId, answer);

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

  const handleApplySuggestion = (suggestion: Suggestion) => {
    // Check if already added
    if (addedSuggestions.includes(suggestion.id)) {
      toast({
        title: "Already Added",
        description: "This product has already been added to the proposal.",
        variant: "destructive",
      });
      return;
    }

    // Add suggestion ID to tracking list
    setAddedSuggestions(prev => [...prev, suggestion.id]);

    // Update the proposal data with the new total
    setProposalData(prev => ({
      ...prev,
      totalCost: (prev.totalCost || 0) + suggestion.price,
      pricing: {
        totalCost: (prev.pricing?.totalCost || prev.totalCost || 0) + suggestion.price
      }
    }));

    // Create a new section item for the suggestion
    const newItem: ProposalItem = {
      id: suggestion.id,
      quantity: 1,
      description: suggestion.productName,
      duration: 'Event Duration',
      price: suggestion.price,
      discount: 0,
      subtotal: suggestion.price,
      category: suggestion.category,
      notes: suggestion.description
    };

    // Find or create an "Additional Services" section
    setSections(prev => {
      const additionalServicesIndex = prev.findIndex(
        section => section.title === 'Additional Services'
      );

      if (additionalServicesIndex >= 0) {
        // Add to existing section
        const updatedSections = [...prev];
        updatedSections[additionalServicesIndex] = {
          ...updatedSections[additionalServicesIndex],
          items: [...updatedSections[additionalServicesIndex].items, newItem],
          total: updatedSections[additionalServicesIndex].total + suggestion.price
        };
        return updatedSections;
      } else {
        // Create new section
        const newSection: ProposalSectionType = {
          id: 'additional-services',
          title: 'Additional Services',
          items: [newItem],
          total: suggestion.price,
          isExpanded: true
        };
        return [...prev, newSection];
      }
    });

    toast({
      title: "Product Added",
      description: `${suggestion.productName} ($${suggestion.price.toLocaleString()}) has been added to your proposal.`,
    });
  };

  const handleConfirmProposal = (confirmedBy: string, date: string) => {
    setConfirmationInfo({ confirmedBy, date });
    
    // Update proposal status to confirmed
    setProposalData(prev => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        status: 'confirmed'
      }
    }));

    setIsConfirmationModalOpen(false);
    
    toast({
      title: "Proposal Approved",
      description: `Approved by ${confirmedBy} on ${new Date(date).toLocaleDateString()}. Status updated to Confirmed.`,
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
                  Approved
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isProposalSigned ? (
                <Button
                  variant="default"
                  size="default"
                  onClick={() => setIsConfirmationModalOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Proposal
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="hover:bg-secondary">
                 
                 
                </Button>
              )}
              
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

          {/* Confirmation Info Display */}
          {confirmationInfo && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-semibold text-success">Proposal Approved</p>
                    <p className="text-sm text-muted-foreground">
                      Approved by <span className="font-medium">{confirmationInfo.confirmedBy}</span> on{' '}
                      {new Date(confirmationInfo.date).toLocaleDateString('en-US', {
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
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="proposal" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Proposal Details
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
                  <h3 className="font-semibold text-foreground">Proposal breakdown</h3>
                  <Badge variant="secondary">
                    {sections.length} categories
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={expandAllSections}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4"
                  >
                    Expand All
                  </Button>
                  <Button
                    size="sm"
                    onClick={collapseAllSections}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4"
                  >
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
                    onItemRemove={handleItemRemove}
                  />
                ))}
              </div>

              {/* Labor Breakdown Note */}
              <p className="text-xs text-muted-foreground text-right mb-2">
                *To see a breakdown of the labor, check the Timeline view
              </p>

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
              <TimelineView
                timeline={proposalData.timeline}
                totalCost={totalCost}
                labor={proposalData.labor}
                pricing={proposalData.pricing}
              />
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
                onAskGeneralQuestion={handleAskGeneralQuestion}
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmProposal}
        proposalData={{
          jobNumber: proposalData.eventDetails.jobNumber,
          clientName: proposalData.eventDetails.clientName,
          totalCost: totalCost
        }}
      />
    </div>
  );
}