"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = form;

    if (!email || !password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user);
        setForm({ email: "", password: "" });

        if (data.user.role === "ADMIN") router.push("/adminDashboard");
        else if (data.user.role === "USER") router.push("/userDashboard");
        else if (data.user.role === "ORGANIZER")
          router.push("/organizerDashboard");
        else router.push("/");
      } else setMessage(data.error || "Login failed.");
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
          transition: "background-color 0.3s, color 0.3s, border 0.3s",
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
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{ marginBottom: "0.25rem", fontWeight: 500, color: "var(--text-color)" }}
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
                transition: "border-color 0.2s, background-color 0.3s, color 0.3s",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{ marginBottom: "0.25rem", fontWeight: 500, color: "var(--text-color)" }}
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
                transition: "border-color 0.2s, background-color 0.3s, color 0.3s",
              }}
            />
          </div>

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
            Login
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
          New here?{" "}
          <Link href="/register" style={{ color: "var(--link-color)", fontWeight: 500 }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}