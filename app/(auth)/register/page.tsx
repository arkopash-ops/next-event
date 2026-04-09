"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    companyName: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, role, companyName } = form;

    if (!name || !email || !password) {
      setMessage("All fields are required.");
      return;
    }

    if (role === "ORGANIZER" && !companyName) {
      setMessage("Company name is required for organizers.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        const meRes = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        const meData = await meRes.json();

        if (meRes.ok) login(meData.user);

        setForm({
          name: "",
          email: "",
          password: "",
          role: "USER",
          companyName: "",
          description: "",
        });

        if (meData.user.role === "USER") router.push("/userDashboard");
        else if (meData.user.role === "ORGANIZER")
          router.push("/organizerDashboard");
        else router.push("/");
      } else {
        setMessage(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        transition: "background-color 0.3s, color 0.3s",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "var(--card-bg)",
          border: `1px solid var(--border-color)`,
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: `0 8px 24px var(--shadow-color)`,
          transition: "background-color 0.3s, border 0.3s, color 0.3s",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            color: "var(--text-color)",
          }}
        >
          Register
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                marginBottom: "0.25rem",
                fontWeight: 500,
                color: "var(--text-color)",
              }}
            >
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: `1px solid var(--border-color)`,
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
                transition:
                  "border-color 0.2s, background-color 0.3s, color 0.3s",
              }}
            />
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                marginBottom: "0.25rem",
                fontWeight: 500,
                color: "var(--text-color)",
              }}
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: `1px solid var(--border-color)`,
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
                transition:
                  "border-color 0.2s, background-color 0.3s, color 0.3s",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                marginBottom: "0.25rem",
                fontWeight: 500,
                color: "var(--text-color)",
              }}
            >
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: `1px solid var(--border-color)`,
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
                transition:
                  "border-color 0.2s, background-color 0.3s, color 0.3s",
              }}
            />
          </div>

          {/* Role */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                marginBottom: "0.25rem",
                fontWeight: 500,
                color: "var(--text-color)",
              }}
            >
              Role:
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: `1px solid var(--border-color)`,
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
                transition:
                  "border-color 0.2s, background-color 0.3s, color 0.3s",
              }}
            >
              <option value="USER">User</option>
              <option value="ORGANIZER">Organizer</option>
            </select>
          </div>

          {/* Organizer fields */}
          {form.role === "ORGANIZER" && (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  style={{
                    marginBottom: "0.25rem",
                    fontWeight: 500,
                    color: "var(--text-color)",
                  }}
                >
                  Company Name:
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  required
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    border: `1px solid var(--border-color)`,
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-color)",
                    transition:
                      "border-color 0.2s, background-color 0.3s, color 0.3s",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  style={{
                    marginBottom: "0.25rem",
                    fontWeight: 500,
                    color: "var(--text-color)",
                  }}
                >
                  Description:
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    border: `1px solid var(--border-color)`,
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-color)",
                    transition:
                      "border-color 0.2s, background-color 0.3s, color 0.3s",
                  }}
                />
              </div>
            </>
          )}

          {/* Submit button */}
          <button
            type="submit"
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              backgroundColor: "var(--orange)",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.2s",
              border: "none",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent1)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--orange)")
            }
          >
            Register
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              color: "var(--error-color)",
              fontWeight: 500,
            }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            marginTop: "1rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "var(--link-color)", fontWeight: 500 }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
