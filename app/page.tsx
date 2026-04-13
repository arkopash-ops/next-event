"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const shellClass = "min-h-screen px-4 py-8 sm:px-6 lg:px-10";
  const wrapClass = "mx-auto flex w-full max-w-7xl flex-col gap-6";
  const cardClass = "rounded-3xl border backdrop-blur-sm";
  const primaryButtonClass =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5";
  const secondaryButtonClass =
    "inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition duration-200";
  const badgeClass =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  const eventCategories = [
    { title: "Movies", image: "/images/movies.jpg" },
    { title: "Comedy Shows", image: "/images/comedy.jpg" },
    { title: "Sports", image: "/images/sports.jpg" },
    { title: "Plays & Theater", image: "/images/plays.jpg" },
    { title: "Workshops", image: "/images/workshops.jpg" },
    { title: "Fun Activities", image: "/images/fun.png" },
  ];

  return (
    <div className={shellClass}>
      <div className={wrapClass}>
        <section
          className={`${cardClass} relative overflow-hidden px-6 py-14 text-center sm:px-10 sm:py-20`}
          style={{
            backgroundImage: "url('/images/hero-bg.png')",
            backgroundColor:
              "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--border-color) 88%, transparent)",
            boxShadow: "0 18px 40px var(--shadow-color)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--bg-color) 38%, transparent), color-mix(in srgb, var(--card-bg) 84%, transparent))",
            }}
          />

          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6">
            <span
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "var(--accent1)" }}
            >
              Plan your next outing
            </span>
            <h1
              className="text-5xl font-black tracking-tight sm:text-7xl"
              style={{ color: "var(--yellow)" }}
            >
              NextEvent
            </h1>
            <p
              className="max-w-2xl text-lg font-medium leading-8 sm:text-2xl"
              style={{ color: "var(--text-color)" }}
            >
              Discover and book tickets for movies, comedy shows, sports events,
              plays, workshops, and fun activities near you.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => router.push("/register")}
                className={`${primaryButtonClass} min-w-40`}
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow:
                    "0 14px 30px color-mix(in srgb, var(--accent2) 20%, transparent)",
                }}
              >
                Register
              </button>
              <button
                onClick={() => router.push("/login")}
                className={`${secondaryButtonClass} min-w-40`}
                style={{
                  background:
                    "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
              >
                Login
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {eventCategories.map((category) => (
            <div
              key={category.title}
              className={`${cardClass} group cursor-pointer overflow-hidden`}
              onClick={() => router.push("/login")}
              style={{
                background:
                  "color-mix(in srgb, var(--card-bg) 92%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--border-color) 88%, transparent)",
                boxShadow: "0 18px 40px var(--shadow-color)",
              }}
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="transition duration-500 group-hover:scale-110"
                  priority={category.title === "Movies"}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in srgb, var(--bg-color) 82%, transparent), transparent)",
                  }}
                />
              </div>

              <div className="space-y-3 p-6">
                <span
                  className={badgeClass}
                  style={{
                    background:
                      "color-mix(in srgb, var(--highlight) 72%, transparent)",
                    color: "var(--text-color)",
                    border:
                      "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                  }}
                >
                  {category.title}
                </span>
                <div className="flex items-center justify-between gap-4">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--text-color)" }}
                  >
                    {category.title}
                  </h2>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--accent1)" }}
                  >
                    Explore
                  </span>
                </div>
                <p
                  className="text-sm leading-6 sm:text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  Browse upcoming {category.title.toLowerCase()} and reserve
                  your spot in seconds.
                </p>
              </div>
            </div>
          ))}
        </section>

        <section
          className={`${cardClass} flex flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center sm:px-8`}
          style={{
            background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--border-color) 88%, transparent)",
            boxShadow: "0 18px 40px var(--shadow-color)",
          }}
        >
          <div className="space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "var(--accent1)" }}
            >
              Start booking
            </p>
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-color)" }}
            >
              Ready to find your next adventure?
            </h2>
            <p
              className="text-sm leading-6 sm:text-base"
              style={{ color: "var(--text-muted)" }}
            >
              Sign in to view events, grab seats, and manage tickets in one
              place.
            </p>
          </div>

          <button
            onClick={() => router.push("/login")}
            className={primaryButtonClass}
            style={{
              background: "var(--gradient-primary)",
              boxShadow:
                "0 14px 30px color-mix(in srgb, var(--accent2) 20%, transparent)",
            }}
          >
            Explore Events
          </button>
        </section>
      </div>
    </div>
  );
}
