import { useState } from "react";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import { apiFetch } from "../services/apiFetch";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTrip = async () => {
    if (!destination || !date) {
      alert("Destination and date are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      await apiFetch("/trips", {
        method: "POST",
        body: JSON.stringify({
          destination,
          date,
          budget,
          description,
          maxMembers: maxMembers ? Number(maxMembers) : undefined,
        }),
      });

      alert("Trip created");
      navigate("/trips");
    } catch (err) {
      alert(err?.message || "Trip creation failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="fg-orb fg-orb-1" aria-hidden="true" />
      <div className="fg-orb fg-orb-2" aria-hidden="true" />
      <div className="fg-page-content mx-auto w-full max-w-2xl">
        <div className="fg-section fg-rise">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="fg-kicker text-xs font-semibold uppercase">
                New journey
              </p>
              <h2 className="fg-title mt-3 text-3xl font-bold">
                Create a trip
              </h2>
              <p className="fg-muted mt-2 text-sm">
                Share where you are headed and invite like-minded travelers.
              </p>
            </div>
            <BackButton />
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

            <div>
              <label className="fg-muted text-xs font-semibold">
                Max travelers
              </label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="10"
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
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
        <Footer />
      </div>
    </div>
  );
}

export default CreateTrip;
