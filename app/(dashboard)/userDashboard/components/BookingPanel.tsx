import { Shows } from "@/types/shows";
import { Ticket } from "@/types/tickets";

type BookingPanelProps = {
  selectedShow: Shows;
  quantity: number;
  setQuantity: (value: number) => void;
  bookingLoading: boolean;
  paymentLoading: boolean;
  bookingId: string | null;
  bookingMessage: string;
  tickets: Ticket[];
  onBook: () => void;
  onPay: () => void;
  onGetTickets: () => void;
};

export default function BookingPanel({
  selectedShow,
  quantity,
  setQuantity,
  bookingLoading,
  paymentLoading,
  bookingId,
  bookingMessage,
  tickets,
  onBook,
  onPay,
  onGetTickets,
}: BookingPanelProps) {
  return (
    <div
      className="space-y-5 rounded-2xl border p-5"
      style={{
        background: "color-mix(in srgb, var(--card-bg) 96%, transparent)",
        borderColor: "color-mix(in srgb, var(--border-color) 80%, transparent)",
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
          Seats: {selectedShow.available_seats} / {selectedShow.total_seats}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className="rounded-2xl border p-4"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 96%, transparent)",
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
            background: "color-mix(in srgb, var(--card-bg) 96%, transparent)",
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
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-xl border px-4 py-3 outline-none transition"
            style={{
              background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
              color: "var(--text-color)",
              borderColor: "var(--border-color)",
            }}
          />
        </div>
      </div>

      <p className="text-lg font-semibold" style={{ color: "var(--text-color)" }}>
        Total: Rs. {Number(selectedShow.price) * quantity}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onBook}
          disabled={bookingLoading || selectedShow.available_seats === 0}
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
            onClick={onPay}
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
            onClick={onGetTickets}
            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition"
            style={{
              background: "color-mix(in srgb, var(--card-bg) 96%, transparent)",
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
                <p className="break-all text-sm font-medium">{ticket.ticketUid}</p>
                <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
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
  );
}
