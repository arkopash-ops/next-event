"use client";

import { useEffect, useState } from "react";
import { GroupedBooking } from "@/types/booking";

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

  if (loading) return <p className="p-4">Loading tickets...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No tickets found</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="p-5 border rounded-lg bg-white shadow-sm space-y-3"
            >
              {/* Booking Info */}
              <div>
                <p className="text-lg font-bold">Event: {booking.eventName}</p>

                <p>
                  <span className="font-semibold">Show Time:</span>{" "}
                  {new Date(booking.showTime).toLocaleString()}
                </p>

                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {booking.quantity}
                </p>

                <p>
                  <span className="font-semibold">Total Price:</span> ₹
                  {booking.totalPrice}
                </p>
              </div>

              {/* Tickets inside booking */}
              <div className="mt-3">
                <p className="font-semibold mb-2">Tickets:</p>

                <div className="space-y-2">
                  {booking.tickets.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 border rounded-md bg-gray-50"
                    >
                      <p>
                        <span className="font-semibold">Ticket UID:</span>{" "}
                        {t.ticketUid}
                      </p>

                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        <span
                          className={
                            t.status === "EXPIRED"
                              ? "text-gray-600"
                              : t.status === "USED"
                                ? "text-red-600"
                                : "text-yellow-600"
                          }
                        >
                          {t.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
