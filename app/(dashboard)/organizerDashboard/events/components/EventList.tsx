import { Event } from "@/types/event";
import Link from "next/link";

type EventListProps = {
  events: Event[];
};

export default function EventList({ events }: EventListProps) {
  if (!events.length) {
    return (
      <div
        className="rounded-2xl border border-dashed p-6 text-center"
        style={{
          color: "var(--text-muted)",
          borderColor:
            "color-mix(in srgb, var(--border-color) 80%, transparent)",
          background: "color-mix(in srgb, var(--card-bg) 82%, transparent)",
        }}
      >
        No events found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <Link
          key={event.id}
          href={`/organizerDashboard/events/${event.id}`}
          className="block rounded-3xl border p-6 backdrop-blur-sm transition hover:-translate-y-1"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--border-color) 88%, transparent)",
            boxShadow: "0 18px 40px var(--shadow-color)",
          }}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: "var(--accent1)" }}
                >
                  {event.category || "Event"}
                </p>
                <h3
                  className="mt-2 text-2xl font-bold"
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
                {event.city || "City"}
              </span>
            </div>

            <p
              className="text-sm leading-6 sm:text-base"
              style={{ color: "var(--text-muted)" }}
            >
              {event.description || "No description added yet."}
            </p>

            <div
              className="text-sm font-medium"
              style={{ color: "var(--accent1)" }}
            >
              Open event details
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
