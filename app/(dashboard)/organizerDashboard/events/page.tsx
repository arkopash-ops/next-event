"use client";

import Link from "next/link";
import EventList from "./components/EventList";
import { useEvents } from "./hooks/useEvents";

export default function EventsPage() {
  const { events, loading, error } = useEvents();

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section
          className="flex flex-col gap-5 rounded-3xl border px-6 py-8 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-8"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--border-color) 88%, transparent)",
            boxShadow: "0 18px 40px var(--shadow-color)",
          }}
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "var(--accent1)" }}
            >
              Organizer Events
            </p>
            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-color)" }}
            >
              My Events
            </h1>
            <p
              className="mt-2 text-sm leading-6 sm:text-base"
              style={{ color: "var(--text-muted)" }}
            >
              Review your event catalog and jump into details in one click.
            </p>
          </div>

          <Link
            href="/organizerDashboard/events/new"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5"
            style={{
              background: "var(--gradient-primary)",
              boxShadow:
                "0 14px 30px color-mix(in srgb, var(--accent2) 20%, transparent)",
            }}
          >
            Create New Event
          </Link>
        </section>

        {error && (
          <p
            className="rounded-2xl px-4 py-3 text-sm font-medium"
            style={{
              color: "var(--error-color)",
              background:
                "color-mix(in srgb, var(--error-color) 12%, var(--card-bg))",
            }}
          >
            {error}
          </p>
        )}

        {loading ? (
          <div
            className="rounded-2xl border border-dashed p-6 text-center"
            style={{
              color: "var(--text-muted)",
              borderColor:
                "color-mix(in srgb, var(--border-color) 80%, transparent)",
              background: "color-mix(in srgb, var(--card-bg) 82%, transparent)",
            }}
          >
            Loading your events...
          </div>
        ) : (
          <EventList events={events} />
        )}
      </div>
    </div>
  );
}
