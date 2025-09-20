import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Edit3, HelpCircle } from "lucide-react";
import { ProposalSection as IProposalSection } from "@/types/proposal";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ProposalSectionProps {
  section: IProposalSection;
  onToggle: (sectionId: string) => void;
  onItemEdit?: (sectionId: string, itemId: string) => void;
  onItemQuestion?: (sectionId: string, itemId: string) => void;
}

export function ProposalSection({ 
  section, 
  onToggle, 
  onItemEdit, 
  onItemQuestion 
}: ProposalSectionProps) {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      audio: "🎵",
      lighting: "💡",
      video: "📹",
      staging: "🎭",
      labor: "👷"
    };
    return icons[category] || "📦";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="border-card-border shadow-sm hover:shadow-md transition-all duration-200">
      <Collapsible open={section.isExpanded} onOpenChange={() => onToggle(section.id)}>
        <CollapsibleTrigger asChild>
          <div className="p-6 cursor-pointer hover:bg-secondary/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{getCategoryIcon(section.id)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    {section.isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {section.items.length} items
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total equipment and services for {section.title.toLowerCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{formatCurrency(section.total)}</p>
                  <p className="text-xs text-muted-foreground">Section Total</p>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-6">
            <div className="bg-secondary/30 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/60 border-b border-card-border">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Qty</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Description</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Duration</th>
                      <th className="text-right p-4 text-sm font-semibold text-foreground">Unit Price</th>
                      <th className="text-right p-4 text-sm font-semibold text-foreground">Subtotal</th>
                      <th className="text-center p-4 text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={cn(
                          "border-b border-card-border hover:bg-secondary/40 transition-colors duration-150",
                          index % 2 === 0 ? "bg-card" : "bg-secondary/20"
                        )}
                      >
                        <td className="p-4 text-center font-semibold text-foreground">{item.quantity}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-foreground">{item.description}</p>
                            {item.notes && (
                              <p className="text-xs text-muted-foreground mt-1 italic">{item.notes}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{item.duration}</td>
                        <td className="p-4 text-right font-semibold text-foreground">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="p-4 text-right font-bold text-primary">
                          {formatCurrency(item.subtotal)}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onItemEdit?.(section.id, item.id)}
                              className="hover:bg-primary-light"
                              title="Edit item"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onItemQuestion?.(section.id, item.id)}
                              className="hover:bg-warning/20"
                              title="Ask question about this item"
                            >
                              <HelpCircle className="h-4 w-4 text-warning" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-card-border">
              <p className="text-sm text-muted-foreground">
                {section.items.length} items • {section.items.reduce((sum, item) => sum + item.quantity, 0)} total quantity
              </p>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{formatCurrency(section.total)}</p>
                <p className="text-xs text-muted-foreground">Section Total</p>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}