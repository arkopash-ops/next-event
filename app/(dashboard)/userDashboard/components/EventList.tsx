import { UserDashboardEvent } from "../types";

type EventListProps = {
  events: UserDashboardEvent[];
  onSelectEvent: (id: string) => void;
};

export default function EventList({ events, onSelectEvent }: EventListProps) {
  return (
    <section
      className="rounded-3xl border p-6 backdrop-blur-sm"
      style={{
        background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
        borderColor: "color-mix(in srgb, var(--border-color) 88%, transparent)",
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
            background: "color-mix(in srgb, var(--highlight) 72%, transparent)",
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
            onClick={() => onSelectEvent(event.id)}
            className="block w-full cursor-pointer rounded-2xl border p-5 text-left transition hover:-translate-y-0.5"
            style={{
              background: "color-mix(in srgb, var(--card-bg) 96%, transparent)",
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

            <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
              {event.organizerName} | {event.companyName}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
