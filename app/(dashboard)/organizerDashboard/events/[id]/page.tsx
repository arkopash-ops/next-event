"use client";

import { EventFormData } from "@/types/event";
import { Shows } from "@/types/shows";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AddShowModal from "../components/AddShowModal";
import EventForm from "../components/EventForm";
import ShowsTable from "../components/ShowsTable";
import { useEvent } from "../hooks/useEvent";

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { event, shows, loading, error, refreshEvent } = useEvent(id);

  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<EventFormData | null>(null);
  const [newShow, setNewShow] = useState({
    show_time: "",
    total_seats: "",
    price: "",
  });
  const [editingShowId, setEditingShowId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <div
            className="rounded-2xl border border-dashed p-6 text-center"
            style={{
              color: "var(--text-muted)",
              borderColor:
                "color-mix(in srgb, var(--border-color) 80%, transparent)",
              background: "color-mix(in srgb, var(--card-bg) 82%, transparent)",
            }}
          >
            Loading event details...
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <p
            className="rounded-2xl px-4 py-3 text-sm font-medium"
            style={{
              color: "var(--error-color)",
              background:
                "color-mix(in srgb, var(--error-color) 12%, var(--card-bg))",
            }}
          >
            {error || "Event not found"}
          </p>
        </div>
      </div>
    );
  }

  const eventForm: EventFormData = {
    title: event.title ?? "",
    description: event.description ?? "",
    category: event.category ?? "",
    city: event.city ?? "",
    venue: event.venue ?? "",
    start_time: toDateTimeLocal(event.start_time),
    end_time: toDateTimeLocal(event.end_time),
  };

  const currentForm = form ?? eventForm;

  const setCurrentForm = (
    value: EventFormData | ((prev: EventFormData) => EventFormData),
  ) => {
    setForm((prev) => {
      const base = prev ?? eventForm;
      return typeof value === "function" ? value(base) : value;
    });
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/event/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentForm),
    });

    const data = await res.json();

    if (data.success) {
      await refreshEvent();
      setIsEditing(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm("Delete this event?")) return;

    const res = await fetch(`/api/event/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      router.push("/organizerDashboard/events");
    }
  };

  const handleSaveShow = async () => {
    const payload = {
      show_time: newShow.show_time,
      total_seats: Number(newShow.total_seats),
      price: Number(newShow.price),
    };

    let url = `/api/event/${id}/event_shows`;
    let method: "POST" | "PATCH" = "POST";

    if (editingShowId) {
      url = `/api/event/${id}/event_shows/${editingShowId}`;
      method = "PATCH";
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      await refreshEvent();
      setShowModal(false);
      setEditingShowId(null);
      setNewShow({ show_time: "", total_seats: "", price: "" });
    }
  };

  const handleEditShow = (show: Shows) => {
    setNewShow({
      show_time: toDateTimeLocal(show.show_time),
      total_seats: String(show.total_seats),
      price: String(show.price),
    });

    setEditingShowId(show.id);
    setShowModal(true);
  };

  const handleDeleteShow = async (showId: string) => {
    const res = await fetch(`/api/event/${id}/event_shows/${showId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      await refreshEvent();
    }
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
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--accent1)" }}
              >
                {event.category || "Event Detail"}
              </p>
              <h1
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                style={{ color: "var(--text-color)" }}
              >
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {event.city && (
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background:
                        "color-mix(in srgb, var(--highlight) 72%, transparent)",
                      color: "var(--text-color)",
                      border:
                        "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                    }}
                  >
                    {event.city}
                  </span>
                )}
                {event.venue && (
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background:
                        "color-mix(in srgb, var(--highlight) 72%, transparent)",
                      color: "var(--text-color)",
                      border:
                        "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                    }}
                  >
                    {event.venue}
                  </span>
                )}
              </div>
              {error && (
                <p
                  style={{ color: "var(--error-color)" }}
                  className="text-sm font-medium"
                >
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {!isEditing && (
                <button
                  onClick={() => {
                    setForm(eventForm);
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition"
                  style={{
                    background:
                      "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  Edit Event
                </button>
              )}

              <button
                onClick={handleDeleteEvent}
                className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition"
                style={{
                  background:
                    "color-mix(in srgb, var(--error-color) 18%, var(--card-bg))",
                  color: "var(--error-color)",
                  borderColor:
                    "color-mix(in srgb, var(--error-color) 45%, var(--border-color))",
                }}
              >
                Delete Event
              </button>
            </div>
          </div>

          <div className="mt-8">
            <EventForm
              form={currentForm}
              setForm={setCurrentForm}
              onSubmit={handleUpdateEvent}
              submitting={false}
              isEditing={isEditing}
            />
          </div>

          {isEditing && (
            <button
              onClick={() => {
                setForm(eventForm);
                setIsEditing(false);
              }}
              className="mt-4 inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition"
              style={{
                background:
                  "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                color: "var(--text-color)",
                borderColor: "var(--border-color)",
              }}
            >
              Cancel
            </button>
          )}
        </section>

        <section
          className="rounded-3xl border px-6 py-8 backdrop-blur-sm sm:px-8"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--border-color) 88%, transparent)",
            boxShadow: "0 18px 40px var(--shadow-color)",
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--accent1)" }}
              >
                Show Schedule
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-color)" }}
              >
                Manage shows
              </h2>
            </div>

            <button
              onClick={() => {
                setEditingShowId(null);
                setNewShow({ show_time: "", total_seats: "", price: "" });
                setShowModal(true);
              }}
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5"
              style={{
                background: "var(--gradient-primary)",
                boxShadow:
                  "0 14px 30px color-mix(in srgb, var(--accent2) 20%, transparent)",
              }}
            >
              Add Show
            </button>
          </div>

          <div className="mt-6">
            <ShowsTable
              shows={shows}
              onEdit={handleEditShow}
              onDelete={handleDeleteShow}
            />
          </div>
        </section>

        <AddShowModal
          showModal={showModal}
          setShowModal={setShowModal}
          newShow={newShow}
          setNewShow={setNewShow}
          onSubmit={handleSaveShow}
          mode={editingShowId ? "edit" : "create"}
        />
      </div>
    </div>
  );
}
