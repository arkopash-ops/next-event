import Link from "next/link";
import { Event } from "@/types/event";

type EventListProps = {
  events: Event[];
};

export default function EventList({ events }: EventListProps) {
  if (!events.length) return <p>No events found</p>;

  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>
          <Link href={`/organizerDashboard/events/${event.id}`}>
            <h3>{event.title}</h3>
            <p>{event.category}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
