export interface ProposalItem {
  id: string;
  quantity: number;
  description: string;
  duration: string;
  price: number;
  discount: number;
  subtotal: number;
  category: string;
  notes?: string;
}

export interface ProposalSection {
  id: string;
  title: string;
  items: ProposalItem[];
  total: number;
  isExpanded: boolean;
}

export interface EventDetails {
  jobNumber: string;
  clientName: string;
  eventLocation: string;
  venue: string;
  startDate: string;
  endDate: string;
  preparedBy: string;
  salesperson: string;
  email: string;
  status: 'tentative' | 'confirmed' | 'completed';
  version: string;
  lastModified: string;
}

export interface ProposalData {
  eventDetails: EventDetails;
  sections: ProposalSection[];
  totalCost: number;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  location: string;
  setup: string[];
  equipment: string[];
  cost: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'message' | 'suggestion' | 'question';
  attachments?: string[];
}

export interface Suggestion {
  id: string;
  type: 'cost-optimization' | 'alternative' | 'upgrade';
  title: string;
  description: string;
  originalCost: number;
  suggestedCost: number;
  savings: number;
  confidence: 'low' | 'medium' | 'high';
}

// New interface for question replies
export interface QuestionReply {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  isFromTeam: boolean;
}