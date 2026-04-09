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

  const linkStyle = (path: string) => ({
    padding: "0.25rem 0.75rem",
    borderRadius: "0.375rem",
    transition: "all 0.2s",
    backgroundColor: pathName === path ? "var(--orange)" : "transparent",
    color: pathName === path ? "var(--text-color)" : "var(--yellow)",
    boxShadow: pathName === path ? "0 4px 6px var(--shadow-color)" : "none",
    cursor: "pointer",
  });

  return (
    <nav
      style={{
        backgroundColor: "var(--brown)",
        color: "var(--yellow)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 2px 8px var(--shadow-color)",
      }}
      className="px-6 py-3 flex justify-between items-center sticky top-0 z-50"
    >
      {/* Logo */}
      <div className="font-extrabold text-2xl tracking-wide">
        Next<span style={{ color: "var(--orange)" }}>Event</span>
      </div>

      <div className="flex items-center gap-5">
        {/* Auth links */}
        {!user && (
          <>
            <Link href="/" style={linkStyle("/")}>
              Home
            </Link>
            <Link href="/login" style={linkStyle("/login")}>
              Login
            </Link>
            <Link href="/register" style={linkStyle("/register")}>
              Register
            </Link>
          </>
        )}

        {/* Role-based links */}
        {user && user.role === "ADMIN" && (
          <div>
            <Link href="/adminDashboard" style={linkStyle("/adminDashboard")}>
              Dashboard
            </Link>
          </div>
        )}

        {user && user.role === "ORGANIZER" && (
          <div>
            <Link
              href="/organizerDashboard"
              style={linkStyle("/organizerDashboard")}
            >
              Dashboard
            </Link>
            <Link
              href="/organizerDashboard/events"
              style={linkStyle("/organizerDashboard/events")}
            >
              Events
            </Link>
          </div>
        )}

        {user && user.role === "USER" && (
          <div>
            <Link href="/userDashboard" style={linkStyle("/userDashboard")}>
              Dashboard
            </Link>
          </div>
        )}

        {/* Logout */}
        {user && (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "red",
              color: "var(--text-color)",
              padding: "0.375rem 1rem",
              borderRadius: "0.375rem",
              transition: "all 0.2s",
              boxShadow: "0 4px 6px var(--shadow-color)",
            }}
            className="hover:scale-105 hover:shadow-lg"
          >
            Logout
          </button>
        )}

        {/* Theme toggle */}
        <div
          onClick={toggleTheme}
          style={{
            padding: "0.5rem",
            borderRadius: "9999px",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          className="hover:bg-[var(--orange)/20] transition"
        >
          {theme === "light" ? (
            <FaMoon size={20} style={{ color: "var(--yellow)" }} />
          ) : (
            <FaSun size={20} style={{ color: "var(--yellow)" }} />
          )}
        </div>
      </div>
    </nav>
  );
};
