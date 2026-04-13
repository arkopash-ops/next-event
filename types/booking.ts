import { TicketItem } from "./tickets";

export interface GroupedBooking {
    bookingId: string;
    eventName: string;
    showTime: Date;
    showId: string;
    totalPrice: string;
    quantity: number;
    tickets: TicketItem[];
};
