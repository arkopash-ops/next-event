"use client";

import { FaMoon, FaSun } from "react-icons/fa";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
  return (
    <nav className="p-4 flex justify-between items-center bg-(--brown) text-(--yellow) sticky top-0 z-50">
      <div className="font-bold text-xl">NextEvent</div>
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
    </nav>
  );
};
