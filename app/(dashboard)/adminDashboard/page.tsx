"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OrganizerProfiles } from "@/types/organizerProfiles";
import { UserProfiles } from "@/types/userProfiles";
import { User } from "@/types/users";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfiles[]>([]);
  const [organizerProfiles, setOrganizerProfiles] = useState<
    OrganizerProfiles[]
  >([]);

  useEffect(() => {
    const admin = localStorage.getItem("user");
    if (admin) {
      const parsedUser = JSON.parse(admin);
      (async () => {
        setName(parsedUser.name);
      })();
    }

    fetch("/api/user/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));

    fetch("/api/user/userProfiles")
      .then((res) => res.json())
      .then((data) => setUserProfiles(data.users));

    fetch("/api/user/organizerProfiles")
      .then((res) => res.json())
      .then((data) => setOrganizerProfiles(data.users));
  }, []);

  const renderTable = <T extends object>(title: string, data: T[]) => {
    if (!data || data.length === 0)
      return (
        <p style={{ color: "var(--error)", marginTop: "0.5rem" }}>
          No data found
        </p>
      );

    const headers = Object.keys(data[0]) as (keyof T)[];

    return (
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            color: "var(--purple)", // purple heading
          }}
        >
          {title}
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: `1px solid var(--border-color)`,
          }}
        >
          <thead>
            <tr>
              {headers.map((key) => (
                <th
                  key={String(key)}
                  style={{
                    border: `1px solid gray`,
                    padding: "0.5rem",
                    textAlign: "left",
                    backgroundColor: "var(--bg-color)",
                    color: "var(--purple)", // purple table headers
                  }}
                >
                  {String(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  backgroundColor:
                    idx % 2 === 0 ? "var(--bg-color)" : "var(--secondary)",
                }}
              >
                {headers.map((key) => (
                  <td
                    key={String(key)}
                    style={{
                      border: `1px solid gray`,
                      padding: "0.5rem",
                      color: "var(--purple)",
                    }}
                  >
                    {typeof item[key] === "object"
                      ? JSON.stringify(item[key])
                      : String(item[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div
        style={{
          padding: "1.5rem",
          backgroundColor: "var(--bg-color)",
          color: "var(--purple)",
          minHeight: "100vh",
          transition: "background-color 0.3s, color 0.3s",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            color: "var(--purple)",
          }}
        >
          Hello, {name || "Admin"}
        </div>

        {renderTable("Users", users)}
        {renderTable("User Profiles", userProfiles)}
        {renderTable("Organizer Profiles", organizerProfiles)}
      </div>
    </ProtectedRoute>
  );
}
