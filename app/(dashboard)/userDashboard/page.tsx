"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Ticket } from "@/types/tickets";
import { Shows } from "@/types/shows";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      (async () => {
        setName(parsedUser.name);
      })();
    }
  }, []);

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
        setSelectedShow(null);
        setBookingId(null);
        setBookingMessage("");
        setTickets([]);
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
    }
  };

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

  return (
    <ProtectedRoute allowedRoles={["USER"]}>
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <section
            className="rounded-3xl border px-6 py-8 backdrop-blur-sm sm:px-8"
            style={{
              background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--border-color) 88%, transparent)",
              boxShadow: "0 18px 40px var(--shadow-color)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "var(--accent1)" }}
            >
              User Dashboard
            </p>
            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-color)" }}
            >
              Hello, {name || "User"}
            </h1>
            <p
              className="mt-2 text-sm leading-6 sm:text-base"
              style={{ color: "var(--text-muted)" }}
            >
              Browse public events, pick a show, and move from booking to
              tickets without leaving the page.
            </p>
          </section>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section
              className="rounded-3xl border p-6 backdrop-blur-sm"
              style={{
                background:
                  "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--border-color) 88%, transparent)",
                boxShadow: "0 18px 40px var(--shadow-color)",
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-color)" }}
                >
                  All Events
                </h2>
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background:
                      "color-mix(in srgb, var(--highlight) 72%, transparent)",
                    color: "var(--text-color)",
                    border:
                      "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                  }}
                >
                  {events.length} listed
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event.id)}
                    className="block w-full cursor-pointer rounded-2xl border p-5 text-left transition hover:-translate-y-0.5"
                    style={{
                      background:
                        "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                      borderColor:
                        "color-mix(in srgb, var(--border-color) 80%, transparent)",
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-[0.3em]"
                          style={{ color: "var(--accent1)" }}
                        >
                          {event.category}
                        </p>
                        <h3
                          className="mt-2 text-xl font-bold"
                          style={{ color: "var(--text-color)" }}
                        >
                          {event.title}
                        </h3>
                      </div>
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background:
                            "color-mix(in srgb, var(--highlight) 72%, transparent)",
                          color: "var(--text-color)",
                          border:
                            "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                        }}
                      >
                        {event.city}
                      </span>
                    </div>

                    <p
                      className="mt-3 text-sm leading-6 sm:text-base"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {event.description}
                    </p>

                    <p
                      className="mt-4 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {event.organizerName} | {event.companyName}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section
              className="rounded-3xl border p-6 backdrop-blur-sm"
              style={{
                background:
                  "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--border-color) 88%, transparent)",
                boxShadow: "0 18px 40px var(--shadow-color)",
              }}
            >
              {selectedEvent ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background:
                            "color-mix(in srgb, var(--highlight) 72%, transparent)",
                          color: "var(--text-color)",
                          border:
                            "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                        }}
                      >
                        {selectedEvent.category}
                      </span>
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background:
                            "color-mix(in srgb, var(--highlight) 72%, transparent)",
                          color: "var(--text-color)",
                          border:
                            "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                        }}
                      >
                        {selectedEvent.city}
                      </span>
                    </div>
                    <h2
                      className="text-3xl font-bold"
                      style={{ color: "var(--text-color)" }}
                    >
                      {selectedEvent.title}
                    </h2>
                    <p
                      className="text-sm leading-6 sm:text-base"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {selectedEvent.description}
                    </p>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <p>
                        {selectedEvent.city} | {selectedEvent.venue}
                      </p>
                      <p>Organizer: {selectedEvent.organizerName}</p>
                      <p>Company: {selectedEvent.companyName}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">Shows</h3>

                    {selectedEvent.shows && selectedEvent.shows.length > 0 ? (
                      <div className="mt-4 space-y-3">
                        {selectedEvent.shows.map((show) => (
                          <button
                            key={show.id}
                            onClick={() => handleShowClick(show.id)}
                            className="flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
                            style={{
                              background:
                                "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                              borderColor:
                                "color-mix(in srgb, var(--border-color) 80%, transparent)",
                            }}
                          >
                            <span>
                              {new Date(show.show_time).toLocaleString()}
                            </span>
                            <span
                              className="text-sm"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {show.available_seats}/{show.total_seats} seats
                            </span>
                            <span
                              className="text-lg font-bold"
                              style={{ color: "var(--accent1)" }}
                            >
                              Rs. {show.price}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="mt-4 rounded-2xl border border-dashed p-6 text-center"
                        style={{
                          color: "var(--text-muted)",
                          borderColor:
                            "color-mix(in srgb, var(--border-color) 80%, transparent)",
                          background:
                            "color-mix(in srgb, var(--card-bg) 82%, transparent)",
                        }}
                      >
                        No shows available.
                      </div>
                    )}
                  </div>

                  {loadingShow && (
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Loading show details...
                    </p>
                  )}

                  {selectedShow && (
                    <div
                      className="space-y-5 rounded-2xl border p-5"
                      style={{
                        background:
                          "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                        borderColor:
                          "color-mix(in srgb, var(--border-color) 80%, transparent)",
                      }}
                    >
                      <div className="space-y-2">
                        <p
                          className="text-xs font-semibold uppercase tracking-[0.3em]"
                          style={{ color: "var(--accent1)" }}
                        >
                          Selected Show
                        </p>
                        <h4
                          className="text-2xl font-bold"
                          style={{ color: "var(--text-color)" }}
                        >
                          {new Date(selectedShow.show_time).toLocaleString()}
                        </h4>
                        <p
                          className="text-sm leading-6 sm:text-base"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Seats: {selectedShow.available_seats} /{" "}
                          {selectedShow.total_seats}
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div
                          className="rounded-2xl border p-4"
                          style={{
                            background:
                              "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                            borderColor:
                              "color-mix(in srgb, var(--border-color) 80%, transparent)",
                          }}
                        >
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Ticket Price
                          </p>
                          <p
                            className="mt-2 text-2xl font-bold"
                            style={{ color: "var(--text-color)" }}
                          >
                            Rs. {selectedShow.price}
                          </p>
                        </div>
                        <div
                          className="rounded-2xl border p-4"
                          style={{
                            background:
                              "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                            borderColor:
                              "color-mix(in srgb, var(--border-color) 80%, transparent)",
                          }}
                        >
                          <label
                            htmlFor="quantity"
                            className="mb-2 block text-sm font-semibold"
                            style={{ color: "var(--text-color)" }}
                          >
                            Tickets
                          </label>
                          <input
                            id="quantity"
                            type="number"
                            min={1}
                            max={selectedShow.available_seats}
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                            className="w-full rounded-xl border px-4 py-3 outline-none transition"
                            style={{
                              background:
                                "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                              color: "var(--text-color)",
                              borderColor: "var(--border-color)",
                            }}
                          />
                        </div>
                      </div>

                      <p
                        className="text-lg font-semibold"
                        style={{ color: "var(--text-color)" }}
                      >
                        Total: Rs. {Number(selectedShow.price) * quantity}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleBooking}
                          disabled={
                            bookingLoading || selectedShow.available_seats === 0
                          }
                          className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                          style={{
                            background: "var(--gradient-primary)",
                            boxShadow:
                              "0 14px 30px color-mix(in srgb, var(--accent2) 20%, transparent)",
                          }}
                        >
                          {bookingLoading ? "Booking..." : "Book Now"}
                        </button>

                        {bookingId && (
                          <button
                            onClick={handlePayment}
                            disabled={paymentLoading}
                            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                            style={{
                              background:
                                "color-mix(in srgb, var(--success-color) 18%, var(--card-bg))",
                              color: "var(--success-color)",
                              borderColor:
                                "color-mix(in srgb, var(--success-color) 45%, var(--border-color))",
                            }}
                          >
                            {paymentLoading ? "Processing..." : "Pay Now"}
                          </button>
                        )}

                        {bookingId && (
                          <button
                            onClick={fetchTickets}
                            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition"
                            style={{
                              background:
                                "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                              color: "var(--text-color)",
                              borderColor: "var(--border-color)",
                            }}
                          >
                            Get Tickets
                          </button>
                        )}
                      </div>

                      {tickets.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-lg font-bold">Your Tickets</h4>
                          <div className="grid gap-3">
                            {tickets.map((ticket) => (
                              <div
                                key={ticket.id}
                                className="rounded-2xl border p-4"
                                style={{
                                  background:
                                    "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                                  borderColor:
                                    "color-mix(in srgb, var(--border-color) 80%, transparent)",
                                }}
                              >
                                <p className="break-all text-sm font-medium">
                                  {ticket.ticketUid}
                                </p>
                                <p
                                  className="mt-2 text-sm"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  Status: {ticket.status}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {bookingMessage && (
                        <p
                          className="rounded-2xl px-4 py-3 text-sm font-medium"
                          style={{
                            background:
                              "color-mix(in srgb, var(--highlight) 68%, var(--card-bg))",
                          }}
                        >
                          {bookingMessage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="rounded-2xl border border-dashed p-6 text-center"
                  style={{
                    color: "var(--text-muted)",
                    borderColor:
                      "color-mix(in srgb, var(--border-color) 80%, transparent)",
                    background:
                      "color-mix(in srgb, var(--card-bg) 82%, transparent)",
                  }}
                >
                  Click an event to view details.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
