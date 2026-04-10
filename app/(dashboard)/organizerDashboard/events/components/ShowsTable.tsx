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
  if (!shows.length) return <p>No shows available</p>;

  return (
    <table
      border={1}
      cellPadding={8}
      style={{ borderCollapse: "collapse", width: "100%" }}
    >
      <thead>
        <tr>
          <th>Show Time</th>
          <th>Total Seats</th>
          <th>Available Seats</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {shows.map((show) => (
          <tr key={show.id}>
            <td>{new Date(show.show_time).toLocaleString()}</td>
            <td>{show.total_seats}</td>
            <td>{show.available_seats}</td>
            <td>₹{Number(show.price).toFixed(2)}</td>

            {/* ACTIONS */}
            <td style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => onEdit(show)}>Edit</button>

              <button
                onClick={() => onDelete(show.id)}
                style={{ color: "red" }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
