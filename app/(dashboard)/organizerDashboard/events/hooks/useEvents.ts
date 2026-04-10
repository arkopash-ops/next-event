import { useEffect, useState } from "react";
import { Event } from "@/types/event";

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/event");
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch events");
                }

                setEvents(data.events || []);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return { events, loading, error };
}
