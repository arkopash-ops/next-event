"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
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

export default function UserDashboardPage() {
  const [name, setName] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Load user
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      (async () => {
        setName(parsedUser.name);
      })();
    }
  }, []);

  // Load events
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
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["USER"]}>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="text-3xl font-bold text-orange-500">
          Hello, {name || "User"}
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* EVENTS LIST */}
          <div>
            <h2 className="text-xl font-bold mb-4">All Events</h2>

            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  className="p-4 border rounded cursor-pointer hover:bg-gray-100 transition"
                >
                  <h3 className="font-bold">{event.title}</h3>

                  <p>{event.description}</p>

                  <p className="text-sm text-gray-600">{event.category}</p>

                  <p className="text-sm text-gray-600">{event.city}</p>

                  <p className="text-xs text-gray-400">
                    {event.organizerName} • {event.companyName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* EVENT DETAILS */}
          <div>
            {selectedEvent ? (
              <div className="p-4 border rounded space-y-3">
                {/* TITLE */}
                <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>

                {/* DESCRIPTION */}
                <p className="text-gray-600">{selectedEvent.description}</p>

                {/* LOCATION */}
                <p>
                  {selectedEvent.city} - {selectedEvent.venue}
                </p>

                {/* ORGANIZER */}
                <p className="text-sm text-gray-500">
                  Organizer: {selectedEvent.organizerName}
                </p>

                <p className="text-sm text-gray-500">
                  Company: {selectedEvent.companyName}
                </p>

                {/* SHOWS */}
                <div>
                  <h3 className="mt-4 font-bold text-lg">Shows</h3>

                  {selectedEvent.shows && selectedEvent.shows.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {selectedEvent.shows.map((show) => (
                        <div
                          key={show.id}
                          className="p-3 border rounded flex justify-between items-center"
                        >
                          <span>
                            {new Date(show.show_time).toLocaleString()}
                          </span>

                          <span className="font-medium text-orange-600">
                            {show.total_seats}
                          </span>

                          <span className="font-medium text-orange-600">
                            {show.available_seats}
                          </span>

                          <span className="font-bold text-orange-600">
                            ₹{show.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-2">No shows available</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                Click an event to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
