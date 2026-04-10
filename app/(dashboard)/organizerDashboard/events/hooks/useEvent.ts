import { useCallback, useEffect, useState } from "react";
import { Event } from "@/types/event";
import { Shows } from "@/types/shows";

type UseEventReturn = {
    event: Event | null;
    shows: Shows[];
    loading: boolean;
    error: string | null;
    refreshEvent: () => Promise<void>;
};

export function useEvent(id: string | string[] | undefined): UseEventReturn {
    const [event, setEvent] = useState<Event | null>(null);
    const [shows, setShows] = useState<Shows[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refreshEvent = useCallback(async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/event/${id}/event_shows`);
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch event");
            }

            setEvent(data.event);
            setShows(data.shows || []);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void refreshEvent();
    }, [refreshEvent]);

    return { event, shows, loading, error, refreshEvent };
}
