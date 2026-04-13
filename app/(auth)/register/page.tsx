"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
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
    <div className={shellClass}>
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section
          className={`${cardClass} hidden min-h-180 overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between`}
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
              Create your profile
            </p>
            <h1
              className="text-5xl font-black leading-tight"
              style={{ color: "var(--text-color)" }}
            >
              Join the crowd behind every great show.
            </h1>
            <p
              className="max-w-lg text-sm leading-6 sm:text-base"
              style={{ color: "var(--text-muted)" }}
            >
              Sign up as a user to book experiences, or register as an organizer
              to start publishing events with a polished dashboard.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "User accounts can discover and manage tickets.",
              "Organizers can publish events and schedule shows.",
              "The interface automatically follows your light and dark theme.",
            ].map((item) => (
              <div
                key={item}
                className={`${panelClass} p-4 text-sm leading-6`}
                style={{
                  background:
                    "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                  borderColor:
                    "color-mix(in srgb, var(--border-color) 80%, transparent)",
                  color: "var(--text-color)",
                }}
              >
                {item}
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
          <div className="mx-auto flex max-w-2xl flex-col gap-6">
            <div className="space-y-2 text-center">
              <p
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--accent1)" }}
              >
                Register
              </p>
              <h1
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                style={{ color: "var(--text-color)" }}
              >
                Create your account
              </h1>
              <p
                className="text-sm leading-6 sm:text-base"
                style={{ color: "var(--text-muted)" }}
              >
                Pick your role and fill in the details below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className={labelClass}
                  style={{ color: "var(--text-color)" }}
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Your full name"
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
                  required
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
                  required
                  className={inputClass}
                  placeholder="Create a strong password"
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
                  htmlFor="role"
                  className={labelClass}
                  style={{ color: "var(--text-color)" }}
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={inputClass}
                  style={{
                    background:
                      "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <option value="USER">User</option>
                  <option value="ORGANIZER">Organizer</option>
                </select>
              </div>

              {form.role === "ORGANIZER" && (
                <>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="companyName"
                      className={labelClass}
                      style={{ color: "var(--text-color)" }}
                    >
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Your brand or company"
                      style={{
                        background:
                          "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                        color: "var(--text-color)",
                        borderColor: "var(--border-color)",
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="description"
                      className={labelClass}
                      style={{ color: "var(--text-color)" }}
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className={`${inputClass} min-h-32`}
                      placeholder="Tell people what you organize"
                      style={{
                        background:
                          "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                        color: "var(--text-color)",
                        borderColor: "var(--border-color)",
                      }}
                    />
                  </div>
                </>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow:
                      "0 14px 30px color-mix(in srgb, var(--accent2) 20%, transparent)",
                  }}
                >
                  Register
                </button>
              </div>
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
              Already have an account?{" "}
              <Link
                href="/login"
                className={linkClass}
                style={{ color: "var(--link-color)" }}
              >
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
