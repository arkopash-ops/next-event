"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "MOVIE",
  "COMEDY",
  "SPORTS",
  "WORKSHOP",
  "PLAY",
  "ACTIVITY",
] as const;

export default function NewOrganizerEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: categories[0],
    city: "",
    venue: "",
    start_time: "",
    end_time: "",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success && data.event?.id) {
        router.push(`/organizerDashboard/events/${data.event.id}`);
        return;
      }

      setMessage(data.message || "Failed to create event");
    } catch (error) {
      console.error(error);
      setMessage("Error creating event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create Event</h1>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "1rem", maxWidth: "32rem" }}
      >
        <input
          required
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          required
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />
        <input
          required
          name="venue"
          placeholder="Venue"
          value={form.venue}
          onChange={handleChange}
        />
        <input
          required
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
        />
        <input
          required
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
