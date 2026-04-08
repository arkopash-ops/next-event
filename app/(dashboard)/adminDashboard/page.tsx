"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OrganizerProfiles } from "@/types/organizerProfiles";
import { UserProfiles } from "@/types/userProfiles";
import { User } from "@/types/users";
import { useEffect, useState } from "react";

export default function RegisterPage() {
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
    if (!data || data.length === 0) return <p>No data found</p>;

    const headers = Object.keys(data[0]) as (keyof T)[];

    return (
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <table className="table-auto border border-gray-400 w-full">
          <thead>
            <tr>
              {headers.map((key) => (
                <th key={String(key)} className="border px-4 py-2">
                  {String(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                {headers.map((key) => (
                  <td key={String(key)} className="border px-4 py-2">
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
      <div className="p-6">
        <div className="text-3xl font-bold text-(--yellow)">
          Hello, {name || "Admin"}
        </div>

        {renderTable("Users", users)}
        {renderTable("User Profiles", userProfiles)}
        {renderTable("Organizer Profiles", organizerProfiles)}
      </div>
    </ProtectedRoute>
  );
}
