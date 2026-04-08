"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
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
        setMessage("Registration successful!");
        localStorage.setItem("user", JSON.stringify(data.user));

        setForm({
          name: "",
          email: "",
          password: "",
          role: "USER",
          companyName: "",
          description: "",
        });

        if (data.user.role === "USER") {
          router.push("/userDashboard");
        } else if (data.user.role === "ORGANIZER") {
          router.push("/organizerDashboard");
        } else {
          router.push("/");
        }
      } else {
        setMessage(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Role:</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="USER">User</option>
            <option value="ORGANIZER">Organizer</option>
          </select>
        </div>

        {/* extra fields for Organizer */}
        {form.role === "ORGANIZER" && (
          <>
            <div>
              <label>Company Name:</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required={form.role === "ORGANIZER"}
              />
            </div>

            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
