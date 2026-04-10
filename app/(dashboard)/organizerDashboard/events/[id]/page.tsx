"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { useEvent } from "../hooks/useEvent";
import EventForm from "../components/EventForm";
import ShowsTable from "../components/ShowsTable";
import AddShowModal from "../components/AddShowModal";

import { EventFormData } from "@/types/event";
import { Shows } from "@/types/shows";

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

  if (loading) return <p>Loading...</p>;
  if (!event)
    return <p style={{ color: "red" }}>{error || "Event not found"}</p>;

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
    <div style={{ padding: "2rem" }}>
      <h1>{event.title}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* EVENT ACTIONS */}
      <div style={{ display: "flex", gap: "1rem" }}>
        {!isEditing && (
          <button
            onClick={() => {
              setForm(eventForm);
              setIsEditing(true);
            }}
          >
            Edit Event
          </button>
        )}

        <button onClick={handleDeleteEvent} style={{ color: "red" }}>
          Delete Event
        </button>
      </div>

      {/* EVENT FORM */}
      <EventForm
        form={currentForm}
        setForm={setCurrentForm}
        onSubmit={handleUpdateEvent}
        submitting={false}
        isEditing={isEditing}
      />

      {isEditing && (
        <button
          onClick={() => {
            setForm(eventForm);
            setIsEditing(false);
          }}
        >
          Cancel
        </button>
      )}

      {/* SHOWS */}
      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => {
            setEditingShowId(null);
            setNewShow({ show_time: "", total_seats: "", price: "" });
            setShowModal(true);
          }}
        >
          Add Show
        </button>

        <ShowsTable
          shows={shows}
          onEdit={handleEditShow}
          onDelete={handleDeleteShow}
        />
      </div>

      {/* MODAL */}
      <AddShowModal
        showModal={showModal}
        setShowModal={setShowModal}
        newShow={newShow}
        setNewShow={setNewShow}
        onSubmit={handleSaveShow}
        mode={editingShowId ? "edit" : "create"}
      />
    </div>
  );
}
