"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const shellClass =
    "min-h-screen px-4 py-8 sm:px-6 lg:px-10 flex items-center justify-center";
  const cardClass = "rounded-3xl border backdrop-blur-sm";
  const panelClass = "rounded-2xl border";
  const labelClass = "mb-2 block text-sm font-semibold";
  const inputClass =
    "w-full rounded-xl border px-4 py-3 outline-none transition";
  const linkClass = "font-semibold transition";

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

    if (!validateForm()) return;

    try {
      const res = await fetch("/api/auth/login", {
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

        setForm({ email: "", password: "" });

        if (meData.user.role === "ADMIN") router.push("/adminDashboard");
        else if (meData.user.role === "USER") router.push("/userDashboard");
        else if (meData.user.role === "ORGANIZER")
          router.push("/organizerDashboard");
        else router.push("/");
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      setMessage("Email is required.");
      return false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setMessage("Enter a valid email address.");
        return false;
      }
    }

    if (!form.password.trim()) {
      setMessage("Password is required.");
      return false;
    } else if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return false;
    }
    setMessage("");
    return true;
  };

  return (
    <div className={shellClass}>
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section
          className={`${cardClass} hidden min-h-155 overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between`}
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--border-color) 88%, transparent)",
            boxShadow: "0 18px 40px var(--shadow-color)",
          }}
        >
          <div className="space-y-4">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "var(--accent1)" }}
            >
              Welcome back
            </p>
            <h1
              className="text-5xl font-black leading-tight"
              style={{ color: "var(--text-color)" }}
            >
              Step into your next event.
            </h1>
            <p
              className="max-w-lg text-sm leading-6 sm:text-base"
              style={{ color: "var(--text-muted)" }}
            >
              Track bookings, browse fresh shows, and manage every ticket from a
              single place that adapts to your theme.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Book faster",
              "View tickets",
              "Explore events",
              "Stay organized",
            ].map((item) => (
              <div
                key={item}
                className={`${panelClass} p-4`}
                style={{
                  background:
                    "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                  borderColor:
                    "color-mix(in srgb, var(--border-color) 80%, transparent)",
                }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--accent1)" }}
                >
                  NextEvent
                </p>
                <p
                  className="mt-2 text-lg font-bold"
                  style={{ color: "var(--text-color)" }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className={`${cardClass} px-6 py-8 sm:px-8 sm:py-10`}
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--border-color) 88%, transparent)",
            boxShadow: "0 18px 40px var(--shadow-color)",
          }}
        >
          <div className="mx-auto flex max-w-md flex-col gap-6">
            <div className="space-y-2 text-center">
              <p
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--accent1)" }}
              >
                Login
              </p>
              <h1
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                style={{ color: "var(--text-color)" }}
              >
                Access your account
              </h1>
              <p
                className="text-sm leading-6 sm:text-base"
                style={{ color: "var(--text-muted)" }}
              >
                Use your email and password to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className={labelClass}
                  style={{ color: "var(--text-color)" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="you@example.com"
                  style={{
                    background:
                      "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className={labelClass}
                  style={{ color: "var(--text-color)" }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your password"
                  style={{
                    background:
                      "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow:
                    "0 14px 30px color-mix(in srgb, var(--accent2) 20%, transparent)",
                }}
              >
                Login
              </button>
            </form>

            {message && (
              <p
                className="rounded-2xl px-4 py-3 text-center text-sm font-medium"
                style={{
                  color: "var(--error-color)",
                  background:
                    "color-mix(in srgb, var(--error-color) 12%, var(--card-bg))",
                }}
              >
                {message}
              </p>
            )}

            <p
              className="text-center text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              New here?{" "}
              <Link
                href="/register"
                className={linkClass}
                style={{ color: "var(--link-color)" }}
              >
                Register
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
