"use client";

import { useState, useEffect, ReactNode } from "react";
import { Navbar } from "./Navbar";

interface ClientLayoutProps {
  children: ReactNode;
}

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    (async () => {
      setMounted(true); // mark that client has mounted
    })();
  }, []);

  useEffect(() => {
    if (!mounted) return; // don't run until mounted
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  if (!mounted) return null; // avoid hydration mismatch

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1">{children}</main>
    </>
  );
};
