"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaMoon, FaSun } from "react-icons/fa";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();

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
    <nav className="p-4 flex justify-between items-center bg-(--brown) text-(--yellow) sticky top-0 z-50">
      <div className="font-bold text-xl">NextEvent</div>

      <div className="flex items-center gap-4">
        {/* Auth links */}
        {!user && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}

        {/* Role-based links */}
        {user && user.role === "ADMIN" && (
          <>
            <Link href="/adminDashboard">Dashboard</Link>
          </>
        )}

        {user && user.role === "ORGANIZER" && (
          <>
            <Link href="/organizerDashboard">Dashboard</Link>
          </>
        )}

        {user && user.role === "USER" && (
          <>
            <Link href="/userDashboard">Dashboard</Link>
          </>
        )}

        {/* logout */}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-(--orange) text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        )}

        {/* theme toggle */}
        {theme === "light" ? (
          <FaMoon
            size={24}
            className="cursor-pointer text-(--orange)"
            onClick={toggleTheme}
          />
        ) : (
          <FaSun
            size={24}
            className="cursor-pointer text-(--orange)"
            onClick={toggleTheme}
          />
        )}
      </div>
    </nav>
  );
};
