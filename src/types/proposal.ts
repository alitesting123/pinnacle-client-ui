// src/types/proposal.ts

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
  pricing?: {
    totalCost: number;
  };
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

// Updated Suggestion interface for product recommendations
export interface Suggestion {
  id: string;
  type: 'upgrade' | 'add-on' | 'bundle' | 'premium';
  title: string;
  description: string;
  productName: string;
  category: string;
  features: string[];
  price: number;
  image?: string;
  confidence: 'low' | 'medium' | 'high';
  compatibility?: string; // What it works with
  benefits: string[]; // Why the customer would want this
}

export interface QuestionReply {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  isFromTeam: boolean;
}

export interface EquipmentQuestionData {
  id: string;
  itemId: string;
  itemName: string;
  sectionName: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  askedBy: string;
  askedAt: string;
  answeredBy?: string;
  answeredAt?: string;
  replies?: QuestionReply[];
}