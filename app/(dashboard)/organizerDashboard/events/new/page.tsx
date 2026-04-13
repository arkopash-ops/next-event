"use client";

import { EventFormData } from "@/types/event";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EventForm from "../components/EventForm";

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
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section
          className="rounded-3xl border px-6 py-8 backdrop-blur-sm sm:px-8"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--border-color) 88%, transparent)",
            boxShadow: "0 18px 40px var(--shadow-color)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--accent1)" }}
          >
            Create Event
          </p>
          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--text-color)" }}
          >
            Build a new event
          </h1>
          <p
            className="mt-2 text-sm leading-6 sm:text-base"
            style={{ color: "var(--text-muted)" }}
          >
            Add the core details first, then manage show timings from the event
            detail screen.
          </p>

          <div className="mt-8">
            <EventForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              submitting={submitting}
              isEditing={true}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
