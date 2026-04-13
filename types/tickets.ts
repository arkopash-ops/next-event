export type Ticket = {
    id: string;
    ticketUid: string;
    bookingId: string;
    eventName: string;
    showTime: string;
    showId: string;
    bookedTickets: number;
    price: string;
    status: string;
};

export type TicketItem = {
    id: string;
    ticketUid: string;
    status: string;
};
