"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";

export default function UserDashboardPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      (async () => {
        setName(parsedUser.name);
      })();
    }
  }, []);
  return (
    <ProtectedRoute allowedRoles={["USER"]}>
      <div className="text-3xl font-bold text-(--orange)">
        Hello, {name || "User"}
      </div>
    </ProtectedRoute>
  );
}
