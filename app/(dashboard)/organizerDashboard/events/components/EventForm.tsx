"use client";

import { EventFormData } from "@/types/event";
import { EVENT_CATEGORIES } from "@/types/eventCategories";
import { useState } from "react";

type EventFormProps = {
  form: EventFormData;
  setForm: React.Dispatch<React.SetStateAction<EventFormData>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  isEditing?: boolean;
};

export default function EventForm({
  form,
  setForm,
  onSubmit,
  submitting,
  isEditing = true,
}: EventFormProps) {
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (message) setMessage("");

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      setMessage("Title is required.");
      return false;
    }

    if (!form.description.trim()) {
      setMessage("Description is required.");
      return false;
    }

    if (!form.category.trim()) {
      setMessage("Category is required.");
      return false;
    }

    if (!form.city.trim()) {
      setMessage("City is required.");
      return false;
    }

    if (!form.venue.trim()) {
      setMessage("Venue is required.");
      return false;
    }

    if (!form.start_time) {
      setMessage("Start time is required.");
      return false;
    }

    if (!form.end_time) {
      setMessage("End time is required.");
      return false;
    }

    const startTime = new Date(form.start_time);
    const endTime = new Date(form.end_time);

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      setMessage("Enter valid start and end times.");
      return false;
    }

    if (endTime <= startTime) {
      setMessage("End time must be later than start time.");
      return false;
    }

    setMessage("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-semibold"
          style={{ color: "var(--text-color)" }}
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full rounded-xl border px-4 py-3 outline-none transition"
          placeholder="Event title"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            color: "var(--text-color)",
            borderColor: "var(--border-color)",
          }}
        />
      </div>

      <div className="md:col-span-2">
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-semibold"
          style={{ color: "var(--text-color)" }}
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={!isEditing}
          className="min-h-36 w-full rounded-xl border px-4 py-3 outline-none transition"
          placeholder="Describe the event"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            color: "var(--text-color)",
            borderColor: "var(--border-color)",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-semibold"
          style={{ color: "var(--text-color)" }}
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full rounded-xl border px-4 py-3 outline-none transition"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            color: "var(--text-color)",
            borderColor: "var(--border-color)",
          }}
        >
          <option value="">Select a category</option>
          {EVENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="city"
          className="mb-2 block text-sm font-semibold"
          style={{ color: "var(--text-color)" }}
        >
          City
        </label>
        <input
          id="city"
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full rounded-xl border px-4 py-3 outline-none transition"
          placeholder="Event city"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            color: "var(--text-color)",
            borderColor: "var(--border-color)",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="venue"
          className="mb-2 block text-sm font-semibold"
          style={{ color: "var(--text-color)" }}
        >
          Venue
        </label>
        <input
          id="venue"
          type="text"
          name="venue"
          value={form.venue}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full rounded-xl border px-4 py-3 outline-none transition"
          placeholder="Venue name"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            color: "var(--text-color)",
            borderColor: "var(--border-color)",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="start_time"
          className="mb-2 block text-sm font-semibold"
          style={{ color: "var(--text-color)" }}
        >
          Start Time
        </label>
        <input
          id="start_time"
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full rounded-xl border px-4 py-3 outline-none transition"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            color: "var(--text-color)",
            borderColor: "var(--border-color)",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="end_time"
          className="mb-2 block text-sm font-semibold"
          style={{ color: "var(--text-color)" }}
        >
          End Time
        </label>
        <input
          id="end_time"
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full rounded-xl border px-4 py-3 outline-none transition"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            color: "var(--text-color)",
            borderColor: "var(--border-color)",
          }}
        />
      </div>

      {isEditing && (
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "var(--gradient-primary)",
              boxShadow:
                "0 14px 30px color-mix(in srgb, var(--accent2) 20%, transparent)",
            }}
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      )}

      {message && (
        <p
          className="md:col-span-2 rounded-2xl px-4 py-3 text-center text-sm font-medium"
          style={{
            color: "var(--error-color)",
            background:
              "color-mix(in srgb, var(--error-color) 12%, var(--card-bg))",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
