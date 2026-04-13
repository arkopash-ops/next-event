"use client";

import { EVENT_CATEGORIES, type EventCategory } from "@/types/eventCategories";

type CategoryFilterProps = {
  selectedCategory: EventCategory | "ALL";
  onSelectCategory: (category: EventCategory | "ALL") => void;
};

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const categories: Array<EventCategory | "ALL"> = ["ALL", ...EVENT_CATEGORIES];

  return (
    <section
      className="rounded-3xl border p-6 backdrop-blur-sm"
      style={{
        background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
        borderColor: "color-mix(in srgb, var(--border-color) 88%, transparent)",
        boxShadow: "0 18px 40px var(--shadow-color)",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--accent1)" }}
          >
            Discover Events
          </p>
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-color)" }}
          >
            Filter by category
          </h2>
        </div>

        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background: "color-mix(in srgb, var(--highlight) 72%, transparent)",
            color: "var(--text-color)",
            border:
              "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
          }}
        >
          {selectedCategory === "ALL" ? "Showing all" : selectedCategory}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                background: isActive
                  ? "var(--gradient-primary)"
                  : "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                color: isActive ? "#ffffff" : "var(--text-color)",
                borderColor: isActive ? "transparent" : "var(--border-color)",
                boxShadow: isActive
                  ? "0 14px 30px color-mix(in srgb, var(--accent2) 20%, transparent)"
                  : "none",
              }}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
}
