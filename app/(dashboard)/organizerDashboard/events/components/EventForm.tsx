"use client";

import { EventFormData } from "@/types/event";
import { EVENT_CATEGORIES } from "@/types/eventCategories";

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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "1rem" }}>
      <input name="title" value={form.title} onChange={handleChange} disabled={!isEditing} />

      <textarea name="description" value={form.description} onChange={handleChange} disabled={!isEditing} />

      <select name="category" value={form.category} onChange={handleChange} disabled={!isEditing}>
        {EVENT_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <input name="city" value={form.city} onChange={handleChange} disabled={!isEditing} />
      <input name="venue" value={form.venue} onChange={handleChange} disabled={!isEditing} />

      <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} disabled={!isEditing} />

      <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} disabled={!isEditing} />

      {isEditing && (
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
      )}
    </form>
  );
}