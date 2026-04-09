"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Event } from "@/types/event";

export default function OrganizerEventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    city: "",
    venue: "",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/event/${id}`);
        const data = await res.json();

        if (res.ok && data.success && data.event) {
          setEvent(data.event);
          setForm(data.event);
          console.log(data.event);
        } else {
          setMessage(data.message || "Event not found");
        }
      } catch (err) {
        console.error(err);
        setMessage("Error fetching event");
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/event/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success && data.event) {
        setMessage("Event updated successfully");
        setEvent(data.event);
        setForm(data.event);
      } else setMessage(data.message || "Update failed");
    } catch (err) {
      console.error(err);
      setMessage("Error updating event");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/event/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/organizerDashboard/events");
      } else setMessage(data.message || "Delete failed");
    } catch (err) {
      console.error(err);
      setMessage("Error deleting event");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!event) return <p>{message || "Event not found"}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Edit Event: {event.title}</h1>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <input name="title" value={form.title} onChange={handleChange} />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
      />
      <input name="category" value={form.category} onChange={handleChange} />
      <input name="city" value={form.city} onChange={handleChange} />
      <input name="venue" value={form.venue} onChange={handleChange} />
      <input
        type="datetime-local"
        name="start_time"
        value={new Date(form.start_time).toISOString().slice(0, 16)}
        onChange={handleChange}
      />
      <input
        type="datetime-local"
        name="end_time"
        value={new Date(form.end_time).toISOString().slice(0, 16)}
        onChange={handleChange}
      />

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleUpdate}>Update Event</button>
        <button onClick={handleDelete} style={{ marginLeft: "1rem" }}>
          Delete Event
        </button>
      </div>
    </div>
  );
}
