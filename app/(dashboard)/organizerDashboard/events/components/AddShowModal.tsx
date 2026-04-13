import { useState } from "react";

import { ShowForm } from "@/types/shows";

type AddShowModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  newShow: ShowForm;
  setNewShow: React.Dispatch<React.SetStateAction<ShowForm>>;
  onSubmit: () => void;
  mode?: "create" | "edit";
};

export default function AddShowModal({
  showModal,
  setShowModal,
  newShow,
  setNewShow,
  onSubmit,
  mode = "create",
}: AddShowModalProps) {
  const [message, setMessage] = useState("");

  if (!showModal) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (message) setMessage("");

    setNewShow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!newShow.show_time) {
      setMessage("Show time is required.");
      return false;
    }

    if (!newShow.total_seats.trim()) {
      setMessage("Total seats is required.");
      return false;
    }

    if (Number(newShow.total_seats) <= 0) {
      setMessage("Total seats must be greater than 0.");
      return false;
    }

    if (!newShow.price.trim()) {
      setMessage("Price is required.");
      return false;
    }

    if (Number(newShow.price) < 0) {
      setMessage("Price cannot be negative.");
      return false;
    }

    setMessage("");
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit();
  };

  const title = mode === "edit" ? "Edit Show" : "Add Show";
  const buttonText = mode === "edit" ? "Update" : "Add";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl border p-6 backdrop-blur-sm sm:p-8"
        style={{
          background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
          borderColor:
            "color-mix(in srgb, var(--border-color) 88%, transparent)",
          boxShadow: "0 18px 40px var(--shadow-color)",
        }}
      >
        <div className="space-y-2">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--accent1)" }}
          >
            Show Manager
          </p>
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-color)" }}
          >
            {title}
          </h2>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="show_time"
              className="mb-2 block text-sm font-semibold"
              style={{ color: "var(--text-color)" }}
            >
              Show Time
            </label>
            <input
              id="show_time"
              type="datetime-local"
              name="show_time"
              value={newShow.show_time}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              required
              className="w-full rounded-xl border px-4 py-3 outline-none transition"
              style={{
                background:
                  "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                color: "var(--text-color)",
                borderColor: "var(--border-color)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="total_seats"
              className="mb-2 block text-sm font-semibold"
              style={{ color: "var(--text-color)" }}
            >
              Total Seats
            </label>
            <input
              id="total_seats"
              type="number"
              name="total_seats"
              value={newShow.total_seats}
              onChange={handleChange}
              min="1"
              required
              className="w-full rounded-xl border px-4 py-3 outline-none transition"
              style={{
                background:
                  "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                color: "var(--text-color)",
                borderColor: "var(--border-color)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-semibold"
              style={{ color: "var(--text-color)" }}
            >
              Price
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={newShow.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full rounded-xl border px-4 py-3 outline-none transition"
              style={{
                background:
                  "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                color: "var(--text-color)",
                borderColor: "var(--border-color)",
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5"
            style={{
              background: "var(--gradient-primary)",
              boxShadow:
                "0 14px 30px color-mix(in srgb, var(--accent2) 20%, transparent)",
            }}
          >
            {buttonText}
          </button>

          <button
            onClick={() => setShowModal(false)}
            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition"
            style={{
              background: "color-mix(in srgb, var(--card-bg) 96%, transparent)",
              color: "var(--text-color)",
              borderColor: "var(--border-color)",
            }}
          >
            Cancel
          </button>
        </div>

        {message && (
          <p
            className="mt-4 rounded-2xl px-4 py-3 text-center text-sm font-medium"
            style={{
              color: "var(--error-color)",
              background:
                "color-mix(in srgb, var(--error-color) 12%, var(--card-bg))",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
