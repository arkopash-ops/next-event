type UserDashboardHeaderProps = {
  name: string;
};

export default function UserDashboardHeader({
  name,
}: UserDashboardHeaderProps) {
  return (
    <section
      className="rounded-3xl border px-6 py-8 backdrop-blur-sm sm:px-8"
      style={{
        background: "color-mix(in srgb, var(--card-bg) 92%, transparent)",
        borderColor: "color-mix(in srgb, var(--border-color) 88%, transparent)",
        boxShadow: "0 18px 40px var(--shadow-color)",
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-[0.3em]"
        style={{ color: "var(--accent1)" }}
      >
        User Dashboard
      </p>
      <h1
        className="text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color: "var(--text-color)" }}
      >
        Hello, {name || "User"}
      </h1>
      <p
        className="mt-2 text-sm leading-6 sm:text-base"
        style={{ color: "var(--text-muted)" }}
      >
        Browse public events, pick a show, and move from booking to tickets
        without leaving the page.
      </p>
    </section>
  );
}
