"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";

export default function OrganizerDashboardPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    const organizer = localStorage.getItem("user");

    if (organizer) {
      const parsedUser = JSON.parse(organizer);
      (async () => {
        setName(parsedUser.name);
      })();
    }
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <section
            className="rounded-3xl border px-6 py-10 backdrop-blur-sm sm:px-8"
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
              Organizer Dashboard
            </p>
            <h1
              className="mt-3 text-4xl font-black tracking-tight sm:text-5xl"
              style={{ color: "var(--text-color)" }}
            >
              Hello, {name || "Organizer"}
            </h1>
            <p
              className="mt-4 max-w-2xl text-sm leading-6 sm:text-base"
              style={{ color: "var(--text-muted)" }}
            >
              Create events, manage show timings, and keep your lineup polished
              across every theme.
            </p>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
