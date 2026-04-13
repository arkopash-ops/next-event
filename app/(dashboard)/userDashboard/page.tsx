"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Shows } from "@/types/shows";
import { useEffect, useState } from "react";
import { Ticket } from "@/types/tickets";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  venue: string;
  start_time: string;
  end_time: string;

  organizerName?: string;
  companyName?: string;

  shows?: Shows[];
}

interface TicketApiResponse {
  ticketUid: string;
  status?: string;
}

export default function UserDashboardPage() {
  const [name, setName] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedShow, setSelectedShow] = useState<Shows | null>(null);
  const [loadingShow, setLoadingShow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Load user
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      (async () => {
        setName(parsedUser.name);
      })();
    }
  }, []);

  // Load events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/event/public");
        const data = await res.json();

        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = async (id: string) => {
    try {
      const res = await fetch(`/api/event/public/${id}`);
      const data = await res.json();

      if (data.success) {
        setSelectedEvent(data.event);
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
    }
  };

  // Fetching show details
  const handleShowClick = async (showId: string) => {
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

  // Booking shows
  const handleBooking = async () => {
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

  // Payment
  const handlePayment = async () => {
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

  const fetchTickets = async () => {
    if (!bookingId || !selectedEvent || !selectedShow) return;

    try {
      const res = await fetch(
        `/api/event/public/${selectedEvent.id}/show/${selectedShow.id}/booking/${bookingId}/tickets`,
      );

      const data = await res.json();

      if (data.success) {
        const formattedTickets: Ticket[] = data.tickets.map(
          (t: TicketApiResponse, index: number) => ({
            id: `${bookingId}-${index}`, // temporary safe key
            ticketUid: t.ticketUid,
            status: t.status ?? "UNUSED",

            // keep compatibility with your type
            bookingId: bookingId,
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

  return (
    <ProtectedRoute allowedRoles={["USER"]}>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="text-3xl font-bold text-orange-500">
          Hello, {name || "User"}
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* EVENTS LIST */}
          <div>
            <h2 className="text-xl font-bold mb-4">All Events</h2>

            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  className="p-4 border rounded cursor-pointer hover:bg-gray-100 transition"
                >
                  <h3 className="font-bold">{event.title}</h3>

                  <p>{event.description}</p>

                  <p className="text-sm text-gray-600">{event.category}</p>

                  <p className="text-sm text-gray-600">{event.city}</p>

                  <p className="text-xs text-gray-400">
                    {event.organizerName} • {event.companyName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* EVENT DETAILS */}
          <div>
            {selectedEvent ? (
              <div className="p-4 border rounded space-y-3">
                {/* TITLE */}
                <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>

                {/* DESCRIPTION */}
                <p className="text-gray-600">{selectedEvent.description}</p>

                {/* LOCATION */}
                <p>
                  {selectedEvent.city} - {selectedEvent.venue}
                </p>

                {/* ORGANIZER */}
                <p className="text-sm text-gray-500">
                  Organizer: {selectedEvent.organizerName}
                </p>

                <p className="text-sm text-gray-500">
                  Company: {selectedEvent.companyName}
                </p>

                {/* SHOWS */}
                <div>
                  <h3 className="mt-4 font-bold text-lg">Shows</h3>

                  {selectedEvent.shows && selectedEvent.shows.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {selectedEvent.shows.map((show) => (
                        <div
                          key={show.id}
                          onClick={() => handleShowClick(show.id)}
                          className="p-3 border rounded flex justify-between items-center cursor-pointer hover:bg-gray-100"
                        >
                          <span>
                            {new Date(show.show_time).toLocaleString()}
                          </span>

                          <span>
                            {show.available_seats}/{show.total_seats}
                          </span>

                          <span className="font-bold text-orange-600">
                            ₹{show.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-2">No shows available</p>
                  )}
                </div>

                {/* SHOW DETAILS */}
                {loadingShow && (
                  <p className="text-sm text-gray-500">
                    Loading show details...
                  </p>
                )}

                {selectedShow && (
                  <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
                    <h4 className="font-bold text-lg">Selected Show</h4>

                    <p>
                      Time: {new Date(selectedShow.show_time).toLocaleString()}
                    </p>

                    <p>Price: ₹{selectedShow.price}</p>

                    <p>
                      Seats: {selectedShow.available_seats} /{" "}
                      {selectedShow.total_seats}
                    </p>

                    <div className="flex items-center gap-3">
                      <label>Tickets:</label>
                      <input
                        type="number"
                        min={1}
                        max={selectedShow.available_seats}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="border px-2 py-1 w-20"
                      />
                    </div>

                    <p className="font-medium">
                      Total: ₹{Number(selectedShow.price) * quantity}
                    </p>

                    <button
                      onClick={handleBooking}
                      disabled={
                        bookingLoading || selectedShow.available_seats === 0
                      }
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
                    >
                      {bookingLoading ? "Booking..." : "Book Now"}
                    </button>

                    {/* 💳 PAYMENT BUTTON */}
                    {bookingId && (
                      <button
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                      >
                        {paymentLoading ? "Processing..." : "Pay Now"}
                      </button>
                    )}

                    {/* FETCH TICKETS */}
                    {bookingId && (
                      <button
                        onClick={fetchTickets}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2 ml-2"
                      >
                        Get Tickets
                      </button>
                    )}

                    {/* TICKETS DISPLAY */}
                    {tickets.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-bold">Your Tickets</h4>

                        <div className="space-y-2 mt-2">
                          {tickets.map((ticket) => (
                            <div
                              key={ticket.id}
                              className="p-2 border rounded bg-white"
                            >
                              {ticket.ticketUid} — {ticket.status}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {bookingMessage && (
                      <p className="text-sm">{bookingMessage}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">
                Click an event to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
