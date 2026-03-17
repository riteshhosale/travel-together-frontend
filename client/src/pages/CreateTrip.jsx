import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTrip = async () => {
    if (!destination || !date) {
      alert("Destination and date are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      await API.post("/trips", { destination, date, budget, description });

      alert("Trip created");
      navigate("/trips");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Trip creation failed. Try again.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="fg-glass mx-auto w-full max-w-2xl rounded-3xl p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
            New journey
          </p>
          <h2 className="fg-title mt-3 text-3xl font-bold">Create a trip</h2>
          <p className="fg-muted mt-2 text-sm">
            Share where you are headed and invite like-minded travelers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="fg-muted text-xs font-semibold">
              Destination
            </label>
            <input
              placeholder="Lisbon, Portugal"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="fg-input mt-2 text-sm"
            />
          </div>

          <div>
            <label className="fg-muted text-xs font-semibold">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="fg-input mt-2 text-sm"
            />
          </div>

          <div>
            <label className="fg-muted text-xs font-semibold">Budget</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="1200"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="fg-input mt-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="fg-muted text-xs font-semibold">
              Description
            </label>
            <input
              placeholder="What kind of trip is this?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="fg-input mt-2 text-sm"
            />
          </div>
        </div>

        <button
          onClick={createTrip}
          disabled={isSubmitting}
          className="fg-btn-primary mt-6 w-full text-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating..." : "Create Trip"}
        </button>
      </div>
    </div>
  );
}

export default CreateTrip;
