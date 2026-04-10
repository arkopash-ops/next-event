"use client";

import Link from "next/link";
import { useEvents } from "./hooks/useEvents";
import EventList from "./components/EventList";

export default function EventsPage() {
  const { events, loading, error } = useEvents();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>My Events</h1>

      <Link href="/organizerDashboard/events/new">
        <button>Create New Event</button>
      </Link>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? <p>Loading...</p> : <EventList events={events} />}
    </div>
  );
}
