"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaMoon, FaSun } from "react-icons/fa";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  const navLinkClass =
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200";

  const linkStyle = (path: string) => ({
    background:
      pathName === path
        ? "var(--gradient-primary)"
        : "color-mix(in srgb, var(--card-bg) 94%, transparent)",
    color: pathName === path ? "#ffffff" : "var(--text-color)",
    border: `1px solid ${
      pathName === path
        ? "color-mix(in srgb, var(--accent2) 55%, transparent)"
        : "color-mix(in srgb, var(--border-color) 80%, transparent)"
    }`,
    boxShadow:
      pathName === path
        ? "0 12px 24px color-mix(in srgb, var(--accent2) 24%, transparent)"
        : "none",
    cursor: "pointer",
  });

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        logout();
        router.push("/login");
      } else {
        console.log("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b px-4 py-3 sm:px-6"
      style={{
        background: "color-mix(in srgb, var(--card-bg) 84%, transparent)",
        borderColor: "color-mix(in srgb, var(--border-color) 78%, transparent)",
        color: "var(--text-color)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 8px 24px var(--shadow-color)",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div
            className="font-extrabold text-2xl tracking-wide"
            style={{ color: "var(--text-color)" }}
          >
            Next<span style={{ color: "var(--accent1)" }}>Event</span>
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition duration-200"
            style={{
              background: "color-mix(in srgb, var(--card-bg) 96%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--border-color) 80%, transparent)",
              color: "var(--text-color)",
            }}
          >
            {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Auth links */}
          {!user && (
            <>
              <Link href="/" className={navLinkClass} style={linkStyle("/")}>
                Home
              </Link>
              <Link
                href="/login"
                className={navLinkClass}
                style={linkStyle("/login")}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={navLinkClass}
                style={linkStyle("/register")}
              >
                Register
              </Link>
            </>
          )}

          {/* Role-based links */}
          {user && user.role === "ADMIN" && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/adminDashboard"
                className={navLinkClass}
                style={linkStyle("/adminDashboard")}
              >
                Dashboard
              </Link>
            </div>
          )}

          {user && user.role === "ORGANIZER" && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/organizerDashboard"
                className={navLinkClass}
                style={linkStyle("/organizerDashboard")}
              >
                Dashboard
              </Link>
              <Link
                href="/organizerDashboard/events"
                className={navLinkClass}
                style={linkStyle("/organizerDashboard/events")}
              >
                Events
              </Link>
            </div>
          )}

          {user && user.role === "USER" && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/userDashboard"
                className={navLinkClass}
                style={linkStyle("/userDashboard")}
              >
                Dashboard
              </Link>
              <Link
                href="/userDashboard/tickets"
                className={navLinkClass}
                style={linkStyle("/userDashboard/tickets")}
              >
                My Tickets
              </Link>
            </div>
          )}

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition duration-200"
              style={{
                background:
                  "color-mix(in srgb, var(--error-color) 18%, var(--card-bg))",
                color: "var(--error-color)",
                borderColor:
                  "color-mix(in srgb, var(--error-color) 45%, var(--border-color))",
                boxShadow:
                  "0 10px 20px color-mix(in srgb, var(--error-color) 12%, transparent)",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
