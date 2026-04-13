import { Event as BaseEvent } from "@/types/event";
import { Shows } from "@/types/shows";

export interface UserDashboardEvent extends BaseEvent {
  organizerName?: string;
  companyName?: string;
  shows?: Shows[];
}

export interface TicketApiResponse {
  ticketUid: string;
  status?: string;
}
