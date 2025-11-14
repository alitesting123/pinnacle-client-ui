import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, Users, User, CheckCircle2, AlertCircle, FileText, Briefcase } from "lucide-react";
import { TimelineEvent, LaborTask } from "@/types/proposal";
import { format } from "date-fns";

interface TimelineViewProps {
  timeline: TimelineEvent[];
  totalCost: number;
  labor?: LaborTask[];
}

export function TimelineView({ timeline, totalCost, labor }: TimelineViewProps) {
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

  const formatTime = (time: string) => {
    // Convert "HH:MM:SS" to "HH:MM AM/PM"
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  // Helper function to get labor tasks for a specific date
  const getLaborForDate = (eventDate: string): LaborTask[] => {
    if (!labor) return [];
    return labor.filter(task => {
      const taskDate = new Date(task.date).toISOString().split('T')[0];
      const eDate = new Date(eventDate).toISOString().split('T')[0];
      return taskDate === eDate;
    });
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
            {timeline.map((event, index) => {
              const laborTasks = getLaborForDate(event.date);
              return (
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

                      {/* Labor Tasks for this day */}
                      {laborTasks.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-card-border">
                          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Labor Schedule for this Day
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="border-b border-card-border bg-muted/20">
                                <tr className="text-left">
                                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase">Task</th>
                                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase text-center">Qty</th>
                                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase">Time</th>
                                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase text-center">Hours</th>
                                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase text-right">Rate</th>
                                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase text-right">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {laborTasks.map((task) => (
                                  <tr key={task.id} className="border-b border-card-border/30 hover:bg-secondary/10 transition-colors">
                                    <td className="p-3">
                                      <div>
                                        <p className="font-medium text-foreground">{task.task_name}</p>
                                        {task.notes && (
                                          <p className="text-xs text-muted-foreground mt-1 italic">{task.notes}</p>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-3 text-center font-medium text-foreground">
                                      {task.quantity}
                                    </td>
                                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                                      {formatTime(task.start_time)} - {formatTime(task.end_time)}
                                    </td>
                                    <td className="p-3 text-center">
                                      <div className="flex items-center justify-center gap-1 text-xs">
                                        {task.regular_hours > 0 && (
                                          <Badge variant="secondary" className="font-mono text-xs px-1.5 py-0.5">
                                            ST:{task.regular_hours}
                                          </Badge>
                                        )}
                                        {task.overtime_hours > 0 && (
                                          <Badge variant="secondary" className="font-mono text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800">
                                            OT:{task.overtime_hours}
                                          </Badge>
                                        )}
                                        {task.double_time_hours > 0 && (
                                          <Badge variant="secondary" className="font-mono text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800">
                                            DT:{task.double_time_hours}
                                          </Badge>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-3 text-right font-semibold text-foreground">
                                      {formatCurrency(task.hourly_rate)}
                                    </td>
                                    <td className="p-3 text-right font-bold text-primary">
                                      {formatCurrency(task.subtotal)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="border-t border-card-border bg-muted/20">
                                <tr>
                                  <td colSpan={5} className="p-3 text-right text-sm font-semibold text-foreground">
                                    Day Labor Total:
                                  </td>
                                  <td className="p-3 text-right font-bold text-primary">
                                    {formatCurrency(laborTasks.reduce((sum, task) => sum + task.subtotal, 0))}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            );
            })}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-card-border bg-muted/30 -mx-6 px-6 pb-6 rounded-b-lg">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-2">Timeline Summary</h3>
            <div className="h-1 w-20 bg-primary rounded"></div>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 ${timeline.some(e => e.crewCount) ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
            {/* Duration Summary */}
            <Card className="border border-card-border shadow-sm hover:shadow-md transition-shadow p-6 bg-background">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-muted rounded">
                    <Calendar className="h-5 w-5 text-foreground" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Event Duration</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-foreground mb-2">{timeline.length}</p>
                  <p className="text-sm text-muted-foreground font-medium">Days</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(timeline[0]?.date), 'MMM dd')} - {format(new Date(timeline[timeline.length - 1]?.date), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Total Cost */}
            <Card className="border border-card-border shadow-sm hover:shadow-md transition-shadow p-6 bg-background">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Proposal Total</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-foreground mb-2">
                    {formatCurrency(totalCost)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">All equipment, labor, and services included</p>
                </div>
              </div>
            </Card>

            {/* Total Hours */}
            <Card className="border border-card-border shadow-sm hover:shadow-md transition-shadow p-6 bg-background">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-muted rounded">
                    <Clock className="h-5 w-5 text-foreground" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Hours</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-foreground mb-2">
                    {timeline.reduce((total, event) => {
                      const [startHour, startMin] = event.startTime.split(':').map(Number);
                      const [endHour, endMin] = event.endTime.split(':').map(Number);
                      return total + ((endHour * 60 + endMin) - (startHour * 60 + startMin)) / 60;
                    }, 0).toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">Hours</p>
                  <p className="text-xs text-muted-foreground mt-2">Production time</p>
                </div>
              </div>
            </Card>

            {/* Peak Crew - Only show if crew data is available */}
            {timeline.some(e => e.crewCount && e.crewCount > 0) && (
              <Card className="border border-card-border shadow-sm hover:shadow-md transition-shadow p-6 bg-background">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-muted rounded">
                      <Users className="h-5 w-5 text-foreground" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Peak Crew</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-foreground mb-2">
                      {Math.max(...timeline.map(e => e.crewCount || 0))}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">People</p>
                    <p className="text-xs text-muted-foreground mt-2">Maximum staffing</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}