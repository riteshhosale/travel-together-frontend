import { useEffect, useState } from "react";
import { apiFetch } from "../services/apiFetch";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiFetch("/trips");

        setTrips(data);
      } catch (err) {
        setError(err?.message || "Failed to load trips");
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, []);

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
              Explore trips
            </p>
            <h2 className="fg-title mt-3 text-3xl font-bold">
              Available trips
            </h2>
            <p className="fg-muted mt-2 text-sm">
              Connect with travelers who share your destination and budget.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-cyan-100/70 px-4 py-2 text-xs font-semibold text-cyan-700">
              {trips.length} trips
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-300/60 bg-rose-100/70 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={`loading-${index}`}
                className="fg-glass rounded-2xl p-6"
              >
                <div className="h-6 w-1/2 rounded-full bg-slate-100" />
                <div className="mt-4 flex gap-2">
                  <div className="h-6 w-24 rounded-full bg-slate-100" />
                  <div className="h-6 w-28 rounded-full bg-slate-100" />
                </div>
                <div className="mt-4 h-4 w-full rounded-full bg-slate-100" />
                <div className="mt-2 h-4 w-4/5 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="fg-glass rounded-2xl border-dashed p-8 text-center text-sm fg-muted">
            No trips yet. Be the first to create one.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="fg-glass rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="fg-title text-xl font-semibold">
                  {trip.destination}
                </h3>
                <div className="fg-muted mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-cyan-100/70 px-3 py-1">
                    Date: {trip.date}
                  </span>
                  <span className="rounded-full bg-cyan-100/70 px-3 py-1">
                    Budget: {trip.budget}
                  </span>
                </div>
                <p className="fg-muted mt-4 text-sm">
                  {trip.description || "No description provided yet."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Trips;
