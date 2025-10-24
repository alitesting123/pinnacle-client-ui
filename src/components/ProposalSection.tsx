// src/components/ProposalSection.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChevronDown, ChevronRight, HelpCircle, Info, Trash2 } from "lucide-react";
import { ProposalSection as IProposalSection } from "@/types/proposal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ProposalSectionProps {
  section: IProposalSection;
  onToggle: (sectionId: string) => void;
  onItemEdit?: (sectionId: string, itemId: string) => void;
  onItemQuestion?: (sectionId: string, itemId: string) => void;
  onItemRemove?: (sectionId: string, itemId: string) => void;
}

const equipmentDescriptions: Record<string, string> = {
  '12" Line Array Speaker': 'High-output professional speakers designed for large venues. Features advanced DSP processing, weather-resistant housing, and excellent sound dispersion for optimal audience coverage.',
  '18" Powered Subwoofer': 'Deep bass extension speakers with built-in amplification. Provides powerful low-frequency response for music and enhanced speech intelligibility.',
  'G50 Wireless Microphone Handheld': 'Professional-grade wireless handheld microphone with digital transmission. Features anti-interference technology and up to 8-hour battery life.',
  'Wireless Lavalier Microphone': 'Discreet clip-on microphone system ideal for presentations and speeches. Ultra-compact design with crystal-clear audio transmission.',
  '24ch Digital Audio Mixer': 'Professional digital mixing console with built-in effects, EQ, and recording capabilities. Perfect for complex audio setups with multiple inputs.',
  'LED Par Can RGBW': 'Color-changing LED lighting fixture with red, green, blue, and white LEDs. DMX controllable with smooth dimming and vibrant color mixing.',
  'Moving Head Spot Light': 'Automated lighting fixture with pan/tilt movement and zoom capabilities. Creates dynamic lighting effects and precise beam control.',
  'Haze Machine': 'Professional atmospheric effect generator that enhances lighting beams and creates ambient atmosphere without triggering smoke detectors.',
  'Grand MA2 Light Console': 'Industry-standard lighting control console for complex shows. Features advanced programming, timeline control, and real-time effects.',
  'DMX Cable (25ft)': 'Professional lighting control cable with 5-pin XLR connectors. Ensures reliable data transmission for lighting fixtures.',
  'Truss Section (10ft)': 'Heavy-duty aluminum truss for mounting lights and equipment. Modular design allows for custom configurations and safe overhead rigging.',
  'Power Distribution': 'Professional power distribution units with circuit protection and monitoring. Ensures safe electrical distribution for all equipment.',
  'Follow Spot': 'Manually operated spotlight for highlighting performers. Features iris control, color filters, and precise beam focusing.',
  '20K Lumens Projector': 'High-brightness professional projector suitable for large screens and bright environments. Features advanced color reproduction and lens options.',
  '16x9 Fast-Fold Screen': 'Portable projection screen with quick setup frame. Professional surface provides excellent image quality for presentations and video.',
  '55" LED Monitor': 'Professional display monitor with high resolution and wide viewing angles. Perfect for presentations, digital signage, and audience viewing.',
  'Video Switcher': 'Multi-input video switching and processing unit. Allows seamless transitions between multiple video sources with effects and graphics.',
  'HD-SDI Cable (50ft)': 'Professional video cable for high-definition signal transmission. Maintains signal integrity over long distances without degradation.',
  '8x4 Stage Deck': 'Portable stage platform section with anti-slip surface. Modular design allows for custom stage configurations and safe performer access.',
  'Stage Riser (2ft)': 'Elevated platform section for creating multi-level staging. Provides excellent sightlines and visual interest for performances.',
  'Acrylic Podium': 'Modern transparent podium with integrated cable management. Maintains clean sightlines while providing presenter support and microphone mounting.',
  'Stage Skirt (Black)': 'Professional fabric skirting to conceal stage framework and equipment. Fire-retardant material with velcro attachment system.',
  'Pipe & Drape (10ft)': 'Adjustable backdrop system with telescoping uprights. Creates professional backdrops and room dividers with various fabric options.',
  'Backdrop Stand': 'Sturdy support structure for banners and fabric backdrops. Adjustable height and width with secure fabric attachment points.',
  'Audio Engineer': 'Certified professional responsible for sound system setup, mixing, and live sound operation throughout your event.',
  'Lighting Technician': 'Skilled technician handling lighting setup, programming, and operation. Ensures optimal lighting design and technical execution.',
  'Video Technician': 'Specialist in video equipment operation, switching, and technical support for all visual elements of your production.',
  'General Labor': 'Experienced crew members for equipment transport, setup, and breakdown. Essential support for efficient event execution.'
};

export function ProposalSection({ 
  section, 
  onToggle, 
  onItemEdit, 
  onItemQuestion,
  onItemRemove
}: ProposalSectionProps) {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      audio: "🎵",
      lighting: "💡",
      video: "📹",
      staging: "🎭",
      labor: "👷"
    };
    return icons[category];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getEquipmentDescription = (description: string): string => {
    return equipmentDescriptions[description] || 'Professional equipment for your event needs.';
  };

  const isAdditionalServices = section.title === 'Additional Services';

  return (
    <Card className="overflow-hidden border-card-border shadow-md">
      <Collapsible open={section.isExpanded} onOpenChange={() => onToggle(section.id)}>
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer bg-gradient-to-r from-secondary/50 to-secondary/30 hover:from-secondary/70 hover:to-secondary/50 transition-all p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {section.isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-foreground transition-transform" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-foreground transition-transform" />
                )}
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(section.id)}</span>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {section.items.length} items
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="font-semibold">
                  {formatCurrency(section.total)}
                </Badge>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-card-border">
                  <tr className="text-left">
                    <th className="p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Item</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Duration</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide text-right">Unit Price</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide text-right">Subtotal</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item) => (
                    <tr key={item.id} className="border-b border-card-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <HoverCard>
                              <HoverCardTrigger>
                                <div className="flex items-center gap-2 cursor-help">
                                  <p className="font-medium text-foreground">{item.description}</p>
                                  <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-96 bg-card/95 backdrop-blur">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-card-foreground flex items-center gap-2">
                                    {getCategoryIcon(item.category)}
                                    {item.description}
                                  </h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {item.category}
                                  </Badge>
                                  <p className="text-sm text-card-foreground/80 leading-relaxed">
                                    {getEquipmentDescription(item.description)}
                                  </p>
                                  <div className="pt-2 border-t border-border/50">
                                    <div className="flex justify-between text-xs text-card-foreground/70">
                                      <span>Duration: {item.duration}</span>
                                      <span>Price: {formatCurrency(item.price)}</span>
                                    </div>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                            {item.notes && (
                              <p className="text-xs text-muted-foreground mt-1 italic">{item.notes}</p>
                            )}
                          </div>
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
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onItemQuestion?.(section.id, item.id)}
                            className="hover:bg-warning/20"
                            title="Ask question about this item"
                          >
                            <HelpCircle className="h-4 w-4 text-warning" />
                          </Button>
                          
                          {isAdditionalServices && onItemRemove && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onItemRemove(section.id, item.id)}
                              className="hover:bg-destructive/20"
                              title="Remove this item from proposal"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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