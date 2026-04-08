"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const eventCategories = [
    { title: "Movies", image: "/images/movies.jpg" },
    { title: "Comedy Shows", image: "/images/comedy.jpg" },
    { title: "Sports", image: "/images/sports.jpg" },
    { title: "Plays & Theater", image: "/images/plays.jpg" },
    { title: "Workshops", image: "/images/workshops.jpg" },
    { title: "Fun Activities", image: "/images/fun.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 transition-colors duration-300">
      {/* Hero Section */}
      <div
        className="w-full flex flex-col items-center justify-center text-center py-20 bg-cover bg-center rounded-lg mb-12 relative"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          color: "white",
        }}
      >
        {/* White overlay */}
        <div className="absolute inset-0 bg-(--bg-color) opacity-20 rounded-lg"></div>

        <h1 className="text-6xl font-extrabold text-(--yellow) mb-6 drop-shadow-lg relative">
          NextEvent
        </h1>
        <p className="text-2xl font-bold text-(--yellow) max-w-2xl drop-shadow-md mb-8 relative">
          Discover and book tickets for movies, comedy shows, sports events,
          plays, workshops, and fun activities near you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 relative">
          <button
            onClick={() => router.push("/register")}
            className="px-8 py-4 rounded-md hover:bg-yellow-400 transition font-semibold"
            style={{ backgroundColor: "var(--orange)", color: "white" }}
          >
            Register
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 rounded-md border-2 font-semibold transition"
            style={{ borderColor: "var(--orange)", color: "var(--orange)" }}
          >
            Login
          </button>
        </div>
      </div>

      {/* Event Categories */}

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {eventCategories.map((category) => (
          <div key={category.title} className="flex flex-col items-center">
            <div
              className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition w-full h-52"
              onClick={() => router.push("/login")}
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                loading="eager"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                priority={category.title === "Movies"}
              />
            </div>
            <h2 className="mt-2 text-center text-lg font-bold text-(--orange)">
              {category.title}
            </h2>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-16 text-center">
        <p className="text-lg mb-4" style={{ color: "var(--brown)" }}>
          Ready to find your next adventure? Start exploring now!
        </p>
        <button
          onClick={() => router.push("/events")}
          className="px-8 py-4 rounded-md hover:bg-yellow-400 transition font-semibold"
          style={{ backgroundColor: "var(--orange)", color: "white" }}
        >
          Explore Events
        </button>
      </div>
    </div>
  );
}
