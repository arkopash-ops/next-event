"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    const admin = localStorage.getItem("user");

    if (admin) {
      const parsedUser = JSON.parse(admin);
      (async () => {
        setName(parsedUser.name);
      })();
    }
  }, []);
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="text-3xl font-bold text-(--yellow)">
        Hello, {name || "Admin"}
      </div>
    </ProtectedRoute>
  );
}
