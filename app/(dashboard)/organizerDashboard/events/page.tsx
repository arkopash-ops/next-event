"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Event } from "@/types/event";

export default function OrganizerEventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/event");
      const data = await res.json();
      if (res.ok && data.success) setEvents(data.events);
      else setMessage(data.message || "Failed to fetch events");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching events");
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => fetchEvents())();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>My Events</h1>
      <Link href="/organizerDashboard/events/new">
        <button>Create New Event</button>
      </Link>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id} style={{ marginBottom: "1rem" }}>
              <Link href={`/organizerDashboard/events/${event.id}`}>
                <h3>{event.title}</h3>
                <h2>
                  {event.category}-{event.description}
                </h2>
                <p>
                  {new Date(event.start_time).toLocaleString()} -{" "}
                  {new Date(event.end_time).toLocaleString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
