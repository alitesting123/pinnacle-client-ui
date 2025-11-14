// src/components/ProposalHeader.tsx - UPDATED with dynamic backgrounds
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, User, Clock, Building } from "lucide-react";
import { EventDetails } from "@/types/proposal";
import { format } from "date-fns";

interface ProposalHeaderProps {
  eventDetails: EventDetails;
  totalCost: number;
}

// Map client names to background images
const getClientBackground = (clientName: string): string => {
  // Normalize client name for comparison (lowercase, remove special chars)
  const normalizedName = clientName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Hash the client name to get a consistent image
  const hashCode = normalizedName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Use modulo to select from available images (1-3)
  const imageNumber = Math.abs(hashCode % 3) + 1;
  
  return `/unsplash${imageNumber}.jpg`;
};

export function ProposalHeader({ eventDetails, totalCost }: ProposalHeaderProps) {
  const statusColors = {
    tentative: "bg-warning text-warning-foreground",
    confirmed: "bg-accent text-accent-foreground", 
    completed: "bg-success text-success-foreground"
  };

  // Format date range as "May 31 - Jun 03, 2026"
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startMonth = format(start, 'MMM dd');
    const endFormatted = format(end, 'MMM dd, yyyy');
    
    return `${startMonth} - ${endFormatted}`;
  };

  // Get the dynamic background image for this client
  const backgroundImage = getClientBackground(eventDetails.clientName);

  return (
    <Card className="border-card-border shadow-md overflow-hidden">
      <div className="relative">
        {/* Background Image - Dynamic based on client */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${backgroundImage}')`
          }}
        />

        {/* Soft Cloudy Gradient Overlay - Creates a smooth blend from image to white */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-0% via-background/30 via-40% via-background/60 via-60% via-background/85 via-75% to-background to-90%"></div>

        {/* Content - positioned over the gradient */}
        <div className="relative">
          {/* Top spacing to show background image with soft blend */}
          <div className="h-32"></div>

          {/* Content area with solid white background for text readability */}
          <div className="bg-background pt-8 pb-8 px-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{eventDetails.clientName}</h1>
                  <Badge className={statusColors[eventDetails.status]}>
                    {eventDetails.status.charAt(0).toUpperCase() + eventDetails.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">Job #{eventDetails.jobNumber} • Version {eventDetails.version}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">${totalCost.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Estimate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-light rounded-lg">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-semibold text-foreground">{eventDetails.venue}</p>
                  <p className="text-xs text-muted-foreground">{eventDetails.eventLocation}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-light rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Event Dates</p>
                  <p className="font-semibold text-foreground">
                    {formatDateRange(eventDetails.startDate, eventDetails.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-light rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sales Contact</p>
                  <p className="font-semibold text-foreground">{eventDetails.preparedBy}</p>
                  <p className="text-xs text-muted-foreground">{eventDetails.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-light rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Changed</p>
                  <p className="font-semibold text-foreground">
                    {format(new Date(eventDetails.lastModified), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(eventDetails.lastModified), 'h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}