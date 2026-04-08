"use client";
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
    <div className="text-3xl font-bold text-(--orange)">
      Hello, {name || "User"}
    </div>
  );
}
