import { Shows } from "@/types/shows";

type ShowsTableProps = {
  shows: Shows[];
  onEdit: (show: Shows) => void;
  onDelete: (showId: string) => void;
};

export default function ShowsTable({
  shows,
  onEdit,
  onDelete,
}: ShowsTableProps) {
  if (!shows.length) {
    return (
      <div
        className="rounded-2xl border border-dashed p-6 text-center"
        style={{
          color: "var(--text-muted)",
          borderColor:
            "color-mix(in srgb, var(--border-color) 80%, transparent)",
          background: "color-mix(in srgb, var(--card-bg) 82%, transparent)",
        }}
      >
        No shows available.
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-3xl border"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
          <thead>
            <tr>
              <th
                className="px-4 py-3 text-left text-sm font-semibold"
                style={{
                  background:
                    "color-mix(in srgb, var(--highlight) 55%, var(--card-bg))",
                  color: "var(--text-color)",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                Show Time
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold"
                style={{
                  background:
                    "color-mix(in srgb, var(--highlight) 55%, var(--card-bg))",
                  color: "var(--text-color)",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                Total Seats
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold"
                style={{
                  background:
                    "color-mix(in srgb, var(--highlight) 55%, var(--card-bg))",
                  color: "var(--text-color)",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                Available Seats
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold"
                style={{
                  background:
                    "color-mix(in srgb, var(--highlight) 55%, var(--card-bg))",
                  color: "var(--text-color)",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                Price
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold"
                style={{
                  background:
                    "color-mix(in srgb, var(--highlight) 55%, var(--card-bg))",
                  color: "var(--text-color)",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {shows.map((show) => (
              <tr
                key={show.id}
                style={{
                  background:
                    "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                }}
              >
                <td
                  className="px-4 py-4 align-top text-sm"
                  style={{
                    color: "var(--text-color)",
                    borderBottom:
                      "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                  }}
                >
                  {new Date(show.show_time).toLocaleString()}
                </td>
                <td
                  className="px-4 py-4 align-top text-sm"
                  style={{
                    color: "var(--text-color)",
                    borderBottom:
                      "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                  }}
                >
                  {show.total_seats}
                </td>
                <td
                  className="px-4 py-4 align-top text-sm"
                  style={{
                    color: "var(--text-color)",
                    borderBottom:
                      "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                  }}
                >
                  {show.available_seats}
                </td>
                <td
                  className="px-4 py-4 align-top text-sm"
                  style={{
                    color: "var(--text-color)",
                    borderBottom:
                      "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                  }}
                >
                  Rs. {Number(show.price).toFixed(2)}
                </td>
                <td
                  className="px-4 py-4 align-top text-sm"
                  style={{
                    color: "var(--text-color)",
                    borderBottom:
                      "1px solid color-mix(in srgb, var(--border-color) 70%, transparent)",
                  }}
                >
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onEdit(show)}
                      className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition"
                      style={{
                        background:
                          "color-mix(in srgb, var(--card-bg) 96%, transparent)",
                        color: "var(--text-color)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(show.id)}
                      className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition"
                      style={{
                        background:
                          "color-mix(in srgb, var(--error-color) 18%, var(--card-bg))",
                        color: "var(--error-color)",
                        borderColor:
                          "color-mix(in srgb, var(--error-color) 45%, var(--border-color))",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
