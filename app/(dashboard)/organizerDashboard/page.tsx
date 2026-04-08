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
      <div className="text-3xl font-bold text-(--yellow)">
        Hello, {name || "Organizer"}
      </div>
    </ProtectedRoute>
  );
}
