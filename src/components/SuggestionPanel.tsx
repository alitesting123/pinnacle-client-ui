import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, ArrowRight, User } from "lucide-react";
import { Suggestion } from "@/types/proposal";

interface SuggestionPanelProps {
  proposalId?: string; // Optional since we're not using it
  onApplySuggestion?: (suggestionId: string) => void;
}

export function SuggestionPanel({ onApplySuggestion }: SuggestionPanelProps) {
  const suggestions: Suggestion[] = [
    {
      id: 'lighting-bundle',
      type: 'cost-optimization',
      title: 'LED Lighting Bundle Discount',
      description: 'Bundle the LED Par Cans and Moving Head Spots together for a 15% discount.',
      originalCost: 11400,
      suggestedCost: 9690,
      savings: 1710,
      confidence: 'high'
    },
    {
      id: 'audio-alternative',
      type: 'alternative',
      title: 'Alternative Audio Setup',
      description: 'Switch to our newer L-Acoustics system which provides better sound quality at a lower rental rate.',
      originalCost: 18750,
      suggestedCost: 16200,
      savings: 2550,
      confidence: 'medium'
    },
    {
      id: 'labor-optimization',
      type: 'cost-optimization',
      title: 'Labor Efficiency Package',
      description: 'Combine some technician roles to reduce overall labor costs while maintaining quality.',
      originalCost: 15600,
      suggestedCost: 13200,
      savings: 2400,
      confidence: 'medium'
    }
  ];

  // Bundle calculation details
  const bundleCalculation = {
    ledParCans: { qty: 24, price: 85, total: 2040 },
    movingHeads: { qty: 8, price: 220, total: 1760 },
    hazeMachines: { qty: 4, price: 150, total: 600 },
    dmxCables: { qty: 50, price: 12, total: 600 },
    truss: { qty: 12, price: 45, total: 540 },
    powerDist: { qty: 8, price: 125, total: 1000 },
    followSpots: { qty: 4, price: 380, total: 1520 },
    lightConsole: { qty: 1, price: 850, total: 2550 }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getSuggestionIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'cost-optimization':
        return <TrendingDown className="h-5 w-5 text-success" />;
      case 'upgrade':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'alternative':
        return <ArrowRight className="h-5 w-5 text-warning" />;
      default:
        return <User className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const totalSavings = suggestions.reduce((total, suggestion) => {
    return total + (suggestion.savings > 0 ? suggestion.savings : 0);
  }, 0);

  return (
    <Card className="border-card-border shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Sales Recommendations</h2>
            <p className="text-sm text-muted-foreground">
              Cost optimization suggestions from our sales team
            </p>
          </div>
          
          {totalSavings > 0 && (
            <Badge className="bg-success text-success-foreground">
              Total Savings: {formatCurrency(totalSavings)}
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="border-card-border">
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{suggestion.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.description}
                    </p>
                    
                    {suggestion.id === 'lighting-bundle' && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Bundle Breakdown:</h4>
                        <div className="text-sm space-y-1">
                          <p className="text-blue-700">All lighting equipment (fixtures, cables, console)</p>
                          <p className="text-blue-700">Regular price: $11,400</p>
                          <p className="text-blue-700">Bundle discount: 15% off</p>
                          <p className="text-blue-800 font-semibold">Your price: $9,690 (Save $1,710)</p>
                        </div>
                      </div>
                    )}

                    {suggestion.id === 'audio-alternative' && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <h4 className="text-sm font-semibold text-green-900 mb-2">Alternative Pricing:</h4>
                        <div className="text-sm space-y-1">
                          <p className="text-green-700">L-Acoustics audio system (newer equipment)</p>
                          <p className="text-green-700">Original system price: $18,750</p>
                          <p className="text-green-700">Better equipment at lower cost</p>
                          <p className="text-green-800 font-semibold">Your price: $16,200 (Save $2,550)</p>
                        </div>
                      </div>
                    )}

                    {suggestion.id === 'labor-optimization' && (
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <h4 className="text-sm font-semibold text-purple-900 mb-2">Labor Efficiency:</h4>
                        <div className="text-sm space-y-1">
                          <p className="text-purple-700">Combined technician roles (audio + lighting)</p>
                          <p className="text-purple-700">Original labor cost: $15,600</p>
                          <p className="text-purple-700">Senior techs handle multiple systems</p>
                          <p className="text-purple-800 font-semibold">Your price: $13,200 (Save $2,400)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(suggestion.originalCost)}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">Suggested</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(suggestion.suggestedCost)}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <p className="text-xs text-muted-foreground">Savings</p>
                    <p className="font-bold text-success">
                      {formatCurrency(suggestion.savings)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    className="bg-gradient-primary hover:opacity-90"
                    onClick={() => onApplySuggestion?.(suggestion.id)}
                  >
                    Apply Suggestion
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}