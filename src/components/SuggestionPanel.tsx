// src/components/SuggestionPanel.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Suggestion } from "@/types/proposal";

interface SuggestionPanelProps {
  proposalId?: string;
  onApplySuggestion?: (suggestion: Suggestion) => void;
}

export function SuggestionPanel({ onApplySuggestion }: SuggestionPanelProps) {
  const suggestions: Suggestion[] = [
    {
      id: 'wireless-mic-upgrade',
      type: 'upgrade',
      title: 'Shure Axient Digital Wireless System',
      description: 'Premium wireless microphone system with superior RF performance and clarity.',
      productName: 'Shure Axient Digital',
      category: 'Audio',
      features: [
        'Crystal-clear digital audio',
        'Advanced interference detection',
        'ShowLink remote control',
        '184 MHz tuning bandwidth'
      ],
      benefits: [
        'Zero dropouts during presentations',
        'Broadcast-quality audio',
        'Works with current audio system'
      ],
      price: 3500,
      compatibility: 'Compatible with existing audio setup',
      confidence: 'high'
    },
    {
      id: 'led-video-wall',
      type: 'add-on',
      title: 'ROE Visual CB5 LED Video Wall',
      description: '10x6 LED video wall for dynamic content display and branding.',
      productName: 'ROE Visual CB5 (10x6ft)',
      category: 'Video',
      features: [
        '2.6mm pixel pitch',
        '5000 nits brightness',
        'Seamless panel alignment',
        'Content management included'
      ],
      benefits: [
        'Immersive visual experiences',
        'Display live feeds and branding',
        'Memorable event impact'
      ],
      price: 8750,
      compatibility: 'Includes content management system',
      confidence: 'high'
    },
    {
      id: 'intelligent-lighting-bundle',
      type: 'bundle',
      title: 'Premium Intelligent Lighting Package',
      description: 'Complete intelligent lighting solution with moving heads and control console.',
      productName: 'Premium Lighting Bundle',
      category: 'Lighting',
      features: [
        '12x Robe MegaPointe moving heads',
        '8x Chauvet Intimidator Beam LEDs',
        'GrandMA3 lighting console',
        'DMX control and programming'
      ],
      benefits: [
        'Dynamic programmed lighting scenes',
        'Concert-level production',
        'Brand color programming'
      ],
      price: 12400,
      compatibility: 'Includes technician and programming',
      confidence: 'medium'
    },
    {
      id: 'projection-mapping',
      type: 'premium',
      title: '3D Projection Mapping Experience',
      description: 'Transform venue with 3D projection mapping on architectural surfaces.',
      productName: 'Custom 3D Projection Mapping',
      category: 'Video',
      features: [
        'Custom content creation',
        '4K laser projectors (3 units)',
        'Professional mapping software',
        'On-site technical team'
      ],
      benefits: [
        'Unforgettable wow factor',
        'Perfect for product launches',
        'Custom branded animations'
      ],
      price: 18500,
      compatibility: 'Venue survey included',
      confidence: 'medium'
    },
    {
      id: 'interactive-touch-screens',
      type: 'add-on',
      title: 'Interactive Touch Screen Displays',
      description: '65" 4K touch displays for engagement and information kiosks.',
      productName: 'Samsung QMR Series (6 units)',
      category: 'Interactive',
      features: [
        '65" 4K UHD displays',
        '20-point multi-touch',
        'Custom interactive software',
        'Modern slim bezels'
      ],
      benefits: [
        'Increase attendee engagement',
        'Self-service information',
        'Real-time data collection'
      ],
      price: 5200,
      compatibility: 'Floor stands and setup included',
      confidence: 'high'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTypeLabel = (type: Suggestion['type']) => {
    switch (type) {
      case 'upgrade':
        return 'Upgrade';
      case 'add-on':
        return 'Add-On';
      case 'bundle':
        return 'Bundle';
      case 'premium':
        return 'Premium';
      default:
        return type;
    }
  };

  return (
    <Card className="border-card-border shadow-md">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Product Recommendations</h2>
          <p className="text-sm text-muted-foreground" aria-label={`${suggestions.length} products suggested for this event`}>
            {suggestions.length} products suggested for this event
          </p>
        </div>

        <div className="space-y-4" role="list" aria-label="Product suggestions">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="border border-card-border" role="listitem">
              <article className="p-4" aria-labelledby={`suggestion-title-${suggestion.id}`}>
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2" role="group" aria-label="Product tags">
                      <Badge variant="outline" className="text-xs" aria-label={`Type: ${getTypeLabel(suggestion.type)}`}>
                        {getTypeLabel(suggestion.type)}
                      </Badge>
                      <Badge variant="outline" className="text-xs" aria-label={`Category: ${suggestion.category}`}>
                        {suggestion.category}
                      </Badge>
                      {suggestion.confidence === 'high' && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800" role="status" aria-label="Highly recommended">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <h3 id={`suggestion-title-${suggestion.id}`} className="font-semibold text-base text-foreground">
                      {suggestion.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                  <div className="text-right ml-4" aria-label={`Price: ${formatCurrency(suggestion.price)}`}>
                    <p className="text-xl font-bold text-foreground">
                      {formatCurrency(suggestion.price)}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-3 pt-3 border-t">
                  {/* Features */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Features
                    </h4>
                    <ul className="space-y-1" role="list" aria-label={`${suggestion.productName} features`}>
                      {suggestion.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="text-sm text-foreground" role="listitem">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Benefits
                    </h4>
                    <ul className="space-y-1" role="list" aria-label={`${suggestion.productName} benefits`}>
                      {suggestion.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-foreground" role="listitem">
                          • {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm text-muted-foreground">
                    {suggestion.compatibility}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onApplySuggestion?.(suggestion)}
                    aria-label={`Add ${suggestion.productName} to proposal for ${formatCurrency(suggestion.price)}`}
                  >
                    Add to Proposal
                  </Button>
                </div>
              </article>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}