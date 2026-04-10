import { ShowForm } from "@/types/shows";


type AddShowModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  newShow: ShowForm;
  setNewShow: React.Dispatch<React.SetStateAction<ShowForm>>;
  onSubmit: () => void;
  mode?: "create" | "edit";
};

export default function AddShowModal({
  showModal,
  setShowModal,
  newShow,
  setNewShow,
  onSubmit,
  mode = "create",
}: AddShowModalProps) {
  if (!showModal) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setNewShow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const title = mode === "edit" ? "Edit Show" : "Add Show";
  const buttonText = mode === "edit" ? "Update" : "Add";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "320px",
        }}
      >
        <h2>{title}</h2>

        <label>Show Time:</label>
        <input
          type="datetime-local"
          name="show_time"
          value={newShow.show_time}
          onChange={handleChange}
          min={new Date().toISOString().slice(0, 16)}
        />

        <label>Total Seats:</label>
        <input
          type="number"
          name="total_seats"
          value={newShow.total_seats}
          onChange={handleChange}
        />

        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={newShow.price}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button onClick={onSubmit}>
            {buttonText}
          </button>

          <button onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}