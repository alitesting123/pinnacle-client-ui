import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingDown, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { Suggestion } from "@/types/proposal";

interface SuggestionPanelProps {
  suggestions: Suggestion[];
  onApplySuggestion?: (suggestionId: string) => void;
}

export function SuggestionPanel({ suggestions, onApplySuggestion }: SuggestionPanelProps) {
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
        return <Lightbulb className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getConfidenceBadge = (confidence: Suggestion['confidence']) => {
    const styles = {
      high: 'bg-success text-success-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-muted text-muted-foreground'
    };
    return styles[confidence];
  };

  const getSavingsColor = (savings: number) => {
    if (savings > 0) return 'text-success';
    if (savings < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <Card className="border-card-border shadow-md">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-light rounded-lg">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Smart Suggestions</h2>
            <p className="text-sm text-muted-foreground">AI-powered recommendations to optimize your proposal</p>
          </div>
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="border-card-border hover:shadow-md transition-shadow duration-200">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary/50 rounded-lg mt-1">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{suggestion.title}</h3>
                        <Badge className={getConfidenceBadge(suggestion.confidence)}>
                          {suggestion.confidence} confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Current Cost</p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(suggestion.originalCost)}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Suggested Cost</p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(suggestion.suggestedCost)}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {suggestion.savings > 0 ? 'Savings' : 'Additional Investment'}
                    </p>
                    <p className={`text-lg font-bold ${getSavingsColor(suggestion.savings)}`}>
                      {suggestion.savings > 0 ? '-' : '+'}{formatCurrency(Math.abs(suggestion.savings))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    <span>AI-analyzed recommendation</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hover:bg-secondary">
                      Learn More
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-primary hover:opacity-90"
                      onClick={() => onApplySuggestion?.(suggestion.id)}
                    >
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {suggestions.length === 0 && (
          <div className="text-center py-8">
            <div className="p-4 bg-secondary/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lightbulb className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No suggestions available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Our AI will analyze your proposal and provide optimization recommendations.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}