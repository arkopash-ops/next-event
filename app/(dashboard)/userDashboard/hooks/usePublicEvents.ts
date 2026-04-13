import { useEffect, useState } from "react";
import { UserDashboardEvent } from "../types";

export function usePublicEvents() {
  const [events, setEvents] = useState<UserDashboardEvent[]>([]);

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

    void fetchEvents();
  }, []);

  return { events };
}
