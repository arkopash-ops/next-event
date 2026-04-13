import { Ticket } from "@/types/tickets";
import { Shows } from "@/types/shows";
import { useState } from "react";
import { TicketApiResponse, UserDashboardEvent } from "../types";

export function useBookingFlow() {
  const [selectedEvent, setSelectedEvent] = useState<UserDashboardEvent | null>(
    null,
  );
  const [selectedShow, setSelectedShow] = useState<Shows | null>(null);
  const [loadingShow, setLoadingShow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const selectEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/event/public/${id}`);
      const data = await res.json();

      if (data.success) {
        setSelectedEvent(data.event);
        setSelectedShow(null);
        setBookingId(null);
        setBookingMessage("");
        setTickets([]);
        setQuantity(1);
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
    }
  };

  const selectShow = async (showId: string) => {
    if (!selectedEvent) return;

    try {
      setLoadingShow(true);

      const res = await fetch(
        `/api/event/public/${selectedEvent.id}/show/${showId}`,
      );

      const data = await res.json();

      if (data.success) {
        setSelectedShow(data.show);
      }
    } catch (error) {
      console.error("Failed to fetch show:", error);
    } finally {
      setLoadingShow(false);
    }
  };

  const createBooking = async () => {
    if (!selectedEvent || !selectedShow) return;

    try {
      setBookingLoading(true);
      setBookingMessage("");

      const res = await fetch(
        `/api/event/public/${selectedEvent.id}/show/${selectedShow.id}/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setBookingMessage("Booking created. Please proceed to payment.");
        setBookingId(data.booking.id);
      } else {
        setBookingMessage(`${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setBookingMessage("Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const payForBooking = async () => {
    if (!bookingId || !selectedEvent || !selectedShow) return;

    try {
      setPaymentLoading(true);

      const res = await fetch(
        `/api/event/public/${selectedEvent.id}/show/${selectedShow.id}/booking/${bookingId}/payment`,
        {
          method: "POST",
        },
      );

      const data = await res.json();

      if (data.success) {
        setBookingMessage("Payment successful! Booking confirmed.");
      } else {
        setBookingMessage(`${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setBookingMessage("Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const loadTickets = async () => {
    if (!bookingId || !selectedEvent || !selectedShow) return;

    try {
      const res = await fetch(
        `/api/event/public/${selectedEvent.id}/show/${selectedShow.id}/booking/${bookingId}/tickets`,
      );

      const data = await res.json();

      if (data.success) {
        const formattedTickets: Ticket[] = data.tickets.map(
          (t: TicketApiResponse, index: number) => ({
            id: `${bookingId}-${index}`,
            ticketUid: t.ticketUid,
            status: t.status ?? "UNUSED",
            bookingId,
            eventName: selectedEvent.title,
            showTime: selectedShow.show_time,
            showId: selectedShow.id,
            bookedTickets: quantity,
            price: selectedShow.price,
          }),
        );

        setTickets(formattedTickets);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  const clearSelection = () => {
    setSelectedEvent(null);
    setSelectedShow(null);
    setBookingId(null);
    setBookingMessage("");
    setTickets([]);
    setQuantity(1);
  };

  return {
    selectedEvent,
    selectedShow,
    loadingShow,
    quantity,
    setQuantity,
    bookingLoading,
    bookingMessage,
    bookingId,
    paymentLoading,
    tickets,
    selectEvent,
    selectShow,
    createBooking,
    payForBooking,
    loadTickets,
    clearSelection,
  };
}
