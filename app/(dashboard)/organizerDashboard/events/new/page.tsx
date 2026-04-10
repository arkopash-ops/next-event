"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import EventForm from "../components/EventForm";
import { EventFormData } from "@/types/event";

export default function NewEventPage() {
  const router = useRouter();

  const [form, setForm] = useState<EventFormData>({
    title: "",
    description: "",
    category: "",
    city: "",
    venue: "",
    start_time: "",
    end_time: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success && data.event?.id) {
      router.push(`/organizerDashboard/events/${data.event.id}`);
    }

    setSubmitting(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create Event</h1>

      <EventForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        submitting={submitting}
        isEditing={true}
      />
    </div>
  );
}
