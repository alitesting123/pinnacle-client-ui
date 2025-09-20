// src/utils/dataTransformer.ts
import type { ProposalData } from "@/types/proposal";

// Transform backend data (snake_case) to frontend format (camelCase)
export function transformProposalData(backendData: any): ProposalData {
  return {
    eventDetails: {
      jobNumber: backendData.event_details.job_number,
      clientName: backendData.event_details.client_name,
      eventLocation: backendData.event_details.event_location,
      venue: backendData.event_details.venue,
      startDate: backendData.event_details.start_date,
      endDate: backendData.event_details.end_date,
      preparedBy: backendData.event_details.prepared_by,
      salesperson: backendData.event_details.salesperson,
      email: backendData.event_details.email,
      status: backendData.event_details.status,
      version: backendData.event_details.version,
      lastModified: backendData.event_details.last_modified,
    },
    sections: backendData.sections.map((section: any) => ({
      id: section.id,
      title: section.title,
      isExpanded: section.is_expanded, // Transform snake_case to camelCase
      total: section.total,
      items: section.items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        description: item.description,
        duration: item.duration,
        price: item.price,
        discount: item.discount,
        subtotal: item.subtotal,
        category: item.category,
        notes: item.notes,
      })),
    })),
    totalCost: backendData.total_cost,
    timeline: backendData.timeline.map((event: any) => ({
      id: event.id,
      date: event.date,
      startTime: event.start_time,
      endTime: event.end_time,
      title: event.title,
      location: event.location,
      setup: event.setup,
      equipment: event.equipment,
      cost: event.cost,
    })),
  };
}