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
    if (!data || data.length === 0) {
      return (
        <section
          className="rounded-3xl border p-6 backdrop-blur-sm"
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--border-color) 88%, transparent)",
            boxShadow: "0 18px 40px var(--shadow-color)",
          }}
        >
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-color)" }}
          >
            {title}
          </h2>
          <p
            className="mt-4 rounded-2xl border border-dashed p-6 text-center"
            style={{
              color: "var(--text-muted)",
              borderColor:
                "color-mix(in srgb, var(--border-color) 80%, transparent)",
              background: "color-mix(in srgb, var(--card-bg) 82%, transparent)",
            }}
          >
            No data found.
          </p>
        </section>
      );
    }

    const headers = Object.keys(data[0]) as (keyof T)[];

    return (
      <section
        className="overflow-hidden rounded-3xl border p-6 backdrop-blur-sm"
        style={{
          background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
          borderColor:
            "color-mix(in srgb, var(--border-color) 88%, transparent)",
          boxShadow: "0 18px 40px var(--shadow-color)",
        }}
      >
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text-color)" }}
        >
          {title}
        </h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
            <thead>
              <tr>
                {headers.map((key) => (
                  <th
                    key={String(key)}
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{
                      background:
                        "color-mix(in srgb, var(--highlight) 55%, var(--card-bg))",
                      color: "var(--text-color)",
                      borderBottom: "1px solid var(--border-color)",
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
                    background:
                      "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                  }}
                >
                  {headers.map((key) => (
                    <td
                      key={String(key)}
                      className="px-4 py-4 align-top text-sm"
                      style={{
                        color: "var(--text-color)",
                        borderBottom:
                          "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
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
      </section>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
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
              Admin Dashboard
            </p>
            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-color)" }}
            >
              Hello, {name || "Admin"}
            </h1>
            <p
              className="mt-2 text-sm leading-6 sm:text-base"
              style={{ color: "var(--text-muted)" }}
            >
              Review platform users and profile data in a cleaner, theme-aware
              control center.
            </p>
          </section>

          {renderTable("Users", users)}
          {renderTable("User Profiles", userProfiles)}
          {renderTable("Organizer Profiles", organizerProfiles)}
        </div>
      </div>
    </ProtectedRoute>
  );
}
