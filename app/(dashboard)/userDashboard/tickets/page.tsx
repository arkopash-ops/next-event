"use client";

import { GroupedBooking } from "@/types/booking";
import { useEffect, useState } from "react";

export default function MyTicketsPage() {
  const [bookings, setBookings] = useState<GroupedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/auth/me/tickets");
        const data = await res.json();

        if (data.success) {
          setBookings(data.tickets);
        }
      } catch (error) {
        console.error("Failed to load tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <div
            className="rounded-2xl border border-dashed p-6 text-center"
            style={{
              color: "var(--text-muted)",
              borderColor:
                "color-mix(in srgb, var(--border-color) 80%, transparent)",
              background: "color-mix(in srgb, var(--card-bg) 82%, transparent)",
            }}
          >
            Loading tickets...
          </div>
        </div>
      </div>
    );
  }

  return (
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
            My Tickets
          </p>
          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--text-color)" }}
          >
            Your bookings
          </h1>
          <p
            className="mt-2 text-sm leading-6 sm:text-base"
            style={{ color: "var(--text-muted)" }}
          >
            Review booking details and ticket statuses across all your events.
          </p>
        </section>

        {bookings.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-6 text-center"
            style={{
              color: "var(--text-muted)",
              borderColor:
                "color-mix(in srgb, var(--border-color) 80%, transparent)",
              background: "color-mix(in srgb, var(--card-bg) 82%, transparent)",
            }}
          >
            No tickets found.
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <section
                key={booking.bookingId}
                className="rounded-3xl border p-6 backdrop-blur-sm"
                style={{
                  background:
                    "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                  borderColor:
                    "color-mix(in srgb, var(--border-color) 88%, transparent)",
                  boxShadow: "0 18px 40px var(--shadow-color)",
                }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.3em]"
                      style={{ color: "var(--accent1)" }}
                    >
                      Booking
                    </p>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-color)" }}
                    >
                      {booking.eventName}
                    </h2>
                    <p
                      className="text-sm leading-6 sm:text-base"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {new Date(booking.showTime).toLocaleString()}
                    </p>
                  </div>

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
                      Qty {booking.quantity}
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
                      Total Rs. {booking.totalPrice}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {booking.tickets.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-2xl border p-4"
                      style={{
                        background:
                          "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                        borderColor:
                          "color-mix(in srgb, var(--border-color) 80%, transparent)",
                      }}
                    >
                      <p
                        className="text-xs font-semibold uppercase tracking-[0.2em]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Ticket UID
                      </p>
                      <p className="mt-2 break-all text-sm font-medium">
                        {t.ticketUid}
                      </p>

                      <p
                        className="mt-4 text-xs font-semibold uppercase tracking-[0.2em]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Status
                      </p>
                      <p
                        className="mt-2 text-sm font-bold"
                        style={{
                          color:
                            t.status === "EXPIRED"
                              ? "var(--secondary-color)"
                              : t.status === "USED"
                                ? "var(--error-color)"
                                : "var(--warning-color)",
                        }}
                      >
                        {t.status}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
