import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, Users, User, CheckCircle2, AlertCircle, FileText } from "lucide-react";
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'confirmed': return 'bg-blue-500 text-white';
      case 'in-progress': return 'bg-yellow-500 text-white';
      case 'scheduled': return 'bg-gray-500 text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
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
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                            <Badge className={getEventColor(event.title)}>
                              Day {index + 1}
                            </Badge>
                            {event.status && (
                              <Badge className={getStatusColor(event.status)}>
                                {event.status}
                              </Badge>
                            )}
                          </div>

                          {/* Basic Info Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 flex-shrink-0" />
                              <span>{format(new Date(event.date), 'EEEE, MMM dd')}</span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              <span>{event.startTime} - {event.endTime} ({calculateDuration(event.startTime, event.endTime)})</span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span>{event.location}</span>
                            </div>

                            {event.crewCount && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4 flex-shrink-0" />
                                <span>{event.crewCount} crew members</span>
                              </div>
                            )}
                          </div>

                          {/* Lead Technician */}
                          {event.leadTechnician && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                              <User className="h-4 w-4 flex-shrink-0" />
                              <span><strong>Lead:</strong> {event.leadTechnician}</span>
                            </div>
                          )}

                          {/* Description */}
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                        </div>

                        {/* Cost Section */}
                        <div className="flex flex-col items-end ml-4">
                          <div className="flex items-center gap-2 text-primary mb-2">
                            <DollarSign className="h-5 w-5" />
                            <span className="text-2xl font-bold">{formatCurrency(event.cost)}</span>
                          </div>
                          {event.costBreakdown && (
                            <div className="text-xs text-right space-y-1 text-muted-foreground">
                              <div>Labor: {formatCurrency(event.costBreakdown.labor)}</div>
                              <div>Equipment: {formatCurrency(event.costBreakdown.equipment)}</div>
                              <div>Materials: {formatCurrency(event.costBreakdown.materials)}</div>
                              <div>Other: {formatCurrency(event.costBreakdown.other)}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Detailed Content Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* Setup Activities */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Setup Activities
                          </h4>
                          <ul className="space-y-2">
                            {event.setup.map((activity, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Equipment Categories */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Equipment Categories</h4>
                          <div className="flex flex-wrap gap-2">
                            {event.equipment.map((category, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Milestones */}
                        {event.milestones && event.milestones.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Key Milestones
                            </h4>
                            <ul className="space-y-2">
                              {event.milestones.map((milestone, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{milestone}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Notes */}
                        {event.notes && event.notes.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Important Notes
                            </h4>
                            <ul className="space-y-2">
                              {event.notes.map((note, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                  <span>{note}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-card-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Event Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Duration Summary */}
            <Card className="border-card-border p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Event Duration</p>
                  <p className="text-lg font-bold text-foreground">{timeline.length} Days</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(timeline[0]?.date), 'MMM dd')} - {format(new Date(timeline[timeline.length - 1]?.date), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Total Cost */}
            <Card className="border-card-border p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(timeline.reduce((total, event) => total + event.cost, 0))}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">All phases included</p>
                </div>
              </div>
            </Card>

            {/* Total Hours */}
            <Card className="border-card-border p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                  <p className="text-lg font-bold text-foreground">
                    {timeline.reduce((total, event) => {
                      const [startHour, startMin] = event.startTime.split(':').map(Number);
                      const [endHour, endMin] = event.endTime.split(':').map(Number);
                      return total + ((endHour * 60 + endMin) - (startHour * 60 + startMin)) / 60;
                    }, 0).toFixed(0)} Hours
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Production time</p>
                </div>
              </div>
            </Card>

            {/* Peak Crew */}
            <Card className="border-card-border p-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Peak Crew Size</p>
                  <p className="text-lg font-bold text-foreground">
                    {Math.max(...timeline.map(e => e.crewCount || 0))} People
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Maximum staffing</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
}