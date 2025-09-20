import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Calendar, Lightbulb, FileText, Settings, Share2 } from "lucide-react";
import { ProposalHeader } from "./ProposalHeader";
import { ProposalSection } from "./ProposalSection";
import { TimelineView } from "./TimelineView";
import { ChatPanel } from "./ChatPanel";
import { SuggestionPanel } from "./SuggestionPanel";
import { ProposalData } from "@/types/proposal";
import { toast } from "@/hooks/use-toast";

interface ProposalDashboardProps {
  proposalData: ProposalData;
}

export function ProposalDashboard({ proposalData }: ProposalDashboardProps) {
  const [sections, setSections] = useState(proposalData.sections);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatQuestion, setChatQuestion] = useState<string>('');

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

  const handleSectionQuestion = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    setChatQuestion(`I have a question about the ${section?.title} section. Can you help me understand the equipment options?`);
    setIsChatOpen(true);
  };

  const handleApplySuggestion = (suggestionId: string) => {
    toast({
      title: "Suggestion Applied",
      description: "The suggestion has been applied to your proposal.",
    });
  };

  const expandAllSections = () => {
    setSections(prev => prev.map(section => ({ ...section, isExpanded: true })));
  };

  const collapseAllSections = () => {
    setSections(prev => prev.map(section => ({ ...section, isExpanded: false })));
  };

  const mockSuggestions = [
    {
      id: 'lighting-optimization',
      type: 'cost-optimization' as const,
      title: 'LED Lighting Bundle Optimization',
      description: 'Replace 24 individual LED Par Cans with 6 high-output LED bars for better coverage and reduced setup time.',
      originalCost: 6120,
      suggestedCost: 4800,
      savings: 1320,
      confidence: 'high' as const
    },
    {
      id: 'audio-upgrade',
      type: 'upgrade' as const,
      title: 'Premium Audio Package',
      description: 'Upgrade to line array system with digital processing for enhanced clarity and coverage.',
      originalCost: 18750,
      suggestedCost: 22500,
      savings: -3750,
      confidence: 'medium' as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Pinnacle Live
              </div>
              <Badge variant="secondary" className="font-medium">
                Proposal Portal
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hover:bg-secondary">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-secondary">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="default"
                size="sm"
                onClick={() => setIsChatOpen(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Support
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
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Analytics
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
                    onSectionQuestion={handleSectionQuestion}
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

            <TabsContent value="suggestions" className="mt-8">
              <SuggestionPanel 
                suggestions={mockSuggestions}
                onApplySuggestion={handleApplySuggestion}
              />
            </TabsContent>

            <TabsContent value="analytics" className="mt-8">
              <div className="text-center py-12">
                <div className="p-4 bg-secondary/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed proposal analytics and performance metrics will be available here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Chat Panel */}
      <ChatPanel 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialQuestion={chatQuestion}
      />
    </div>
  );
}