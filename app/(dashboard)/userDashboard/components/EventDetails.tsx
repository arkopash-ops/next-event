import { Shows } from "@/types/shows";
import { Ticket } from "@/types/tickets";
import BookingPanel from "./BookingPanel";
import { UserDashboardEvent } from "../types";

type EventDetailsProps = {
  selectedEvent: UserDashboardEvent | null;
  selectedShow: Shows | null;
  loadingShow: boolean;
  quantity: number;
  setQuantity: (value: number) => void;
  bookingLoading: boolean;
  paymentLoading: boolean;
  bookingId: string | null;
  bookingMessage: string;
  tickets: Ticket[];
  onSelectShow: (showId: string) => void;
  onBook: () => void;
  onPay: () => void;
  onGetTickets: () => void;
};

export default function EventDetails({
  selectedEvent,
  selectedShow,
  loadingShow,
  quantity,
  setQuantity,
  bookingLoading,
  paymentLoading,
  bookingId,
  bookingMessage,
  tickets,
  onSelectShow,
  onBook,
  onPay,
  onGetTickets,
}: EventDetailsProps) {
  return (
    <section
      className="rounded-3xl border p-6 backdrop-blur-sm"
      style={{
        background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
        borderColor: "color-mix(in srgb, var(--border-color) 88%, transparent)",
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
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
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
                    onClick={() => onSelectShow(show.id)}
                    className="flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
                    style={{
                      background:
                        "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                      borderColor:
                        "color-mix(in srgb, var(--border-color) 80%, transparent)",
                    }}
                  >
                    <span>{new Date(show.show_time).toLocaleString()}</span>
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
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Loading show details...
            </p>
          )}

          {selectedShow && (
            <BookingPanel
              selectedShow={selectedShow}
              quantity={quantity}
              setQuantity={setQuantity}
              bookingLoading={bookingLoading}
              paymentLoading={paymentLoading}
              bookingId={bookingId}
              bookingMessage={bookingMessage}
              tickets={tickets}
              onBook={onBook}
              onPay={onPay}
              onGetTickets={onGetTickets}
            />
          )}
        </div>
      ) : (
        <div
          className="rounded-2xl border border-dashed p-6 text-center"
          style={{
            color: "var(--text-muted)",
            borderColor:
              "color-mix(in srgb, var(--border-color) 80%, transparent)",
            background: "color-mix(in srgb, var(--card-bg) 82%, transparent)",
          }}
        >
          Click an event to view details.
        </div>
      )}
    </section>
  );
}
