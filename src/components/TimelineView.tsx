import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react";
import { TimelineEvent } from "@/types/proposal";
import { format } from "date-fns";

interface TimelineViewProps {
  timeline: TimelineEvent[];
}

export function TimelineView({ timeline }: TimelineViewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getEventColor = (title: string) => {
    if (title.includes('Load-in') || title.includes('Setup')) return 'bg-warning text-warning-foreground';
    if (title.includes('Event Day')) return 'bg-primary text-primary-foreground';
    if (title.includes('Strike') || title.includes('Load-out')) return 'bg-muted text-muted-foreground';
    return 'bg-secondary text-secondary-foreground';
  };

  return (
    <Card className="border-card-border shadow-md">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Event Timeline</h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-8">
            {timeline.map((event, index) => (
              <div key={event.id} className="relative flex items-start gap-6">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-md"></div>
                </div>

                {/* Event content */}
                <div className="flex-1 min-w-0">
                  <Card className="border-card-border hover:shadow-md transition-shadow duration-200">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                            <Badge className={getEventColor(event.title)}>
                              Day {index + 1}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(event.date), 'EEEE, MMM dd')}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{event.startTime} - {event.endTime}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-primary">
                          <DollarSign className="h-5 w-5" />
                          <span className="text-2xl font-bold">{formatCurrency(event.cost)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Setup Activities</h4>
                          <ul className="space-y-1">
                            {event.setup.map((activity, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Equipment Categories</h4>
                          <div className="flex flex-wrap gap-2">
                            {event.equipment.map((category, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-card-border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-foreground">Total Event Duration</p>
              <p className="text-sm text-muted-foreground">
                {timeline.length} days • {format(new Date(timeline[0]?.date), 'MMM dd')} - {format(new Date(timeline[timeline.length - 1]?.date), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(timeline.reduce((total, event) => total + event.cost, 0))}
              </p>
              <p className="text-sm text-muted-foreground">Timeline Total</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}