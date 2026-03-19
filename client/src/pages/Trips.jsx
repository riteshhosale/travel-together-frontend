import { useCallback, useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import { apiFetch } from "../services/apiFetch";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [joiningTripId, setJoiningTripId] = useState(null);
  const [memberCounts, setMemberCounts] = useState({});

  const getMemberCount = useCallback((payload) => {
    if (Array.isArray(payload)) {
      return payload.length;
    }
    if (payload && Array.isArray(payload.members)) {
      return payload.members.length;
    }
    if (payload && typeof payload.count === "number") {
      return payload.count;
    }
    return 0;
  }, []);

  const fetchMemberCount = useCallback(
    async (tripId) => {
      try {
        const data = await apiFetch(`/trips/${tripId}/members`);
        const count = getMemberCount(data);
        setMemberCounts((prev) => ({ ...prev, [tripId]: count }));
        return count;
      } catch (err) {
        return null;
      }
    },
    [getMemberCount],
  );

  useEffect(() => {
    const loadTrips = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await apiFetch("/trips");

        setTrips(data);
        await Promise.all(
          (data || []).map((trip) => fetchMemberCount(trip._id)),
        );
      } catch (err) {
        setError(err?.message || "Failed to load trips");
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, [fetchMemberCount]);

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="fg-orb fg-orb-1" aria-hidden="true" />
      <div className="fg-orb fg-orb-2" aria-hidden="true" />
      <div className="fg-page-content mx-auto w-full max-w-5xl fg-rise">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="fg-kicker text-xs font-semibold uppercase">
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
            <BackButton />
            <span className="fg-chip text-xs font-semibold">
              {trips.length} trips
            </span>
          </div>
        </div>

        {error && (
          <div className="fg-alert mb-6 px-4 py-3 text-sm">{error}</div>
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div key={`loading-${index}`} className="fg-card p-6">
                <div className="h-6 w-1/2 rounded-full bg-slate-800/70" />
                <div className="mt-4 flex gap-2">
                  <div className="h-6 w-24 rounded-full bg-slate-800/70" />
                  <div className="h-6 w-28 rounded-full bg-slate-800/70" />
                </div>
                <div className="mt-4 h-4 w-full rounded-full bg-slate-800/70" />
                <div className="mt-2 h-4 w-4/5 rounded-full bg-slate-800/70" />
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="fg-card border-dashed p-8 text-center text-sm fg-muted">
            No trips yet. Be the first to create one.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="fg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="fg-title text-xl font-semibold">
                  {trip.destination}
                </h3>
                <div className="fg-muted mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="fg-chip">Date: {trip.date}</span>
                  <span className="fg-chip">Budget: {trip.budget}</span>
                  <span className="fg-chip">
                    Members: {memberCounts[trip._id] ?? "--"}
                    {trip.maxMembers ? ` / ${trip.maxMembers}` : ""}
                  </span>
                </div>
                <p className="fg-muted mt-4 text-sm">
                  {trip.description || "No description provided yet."}
                </p>
                <div className="mt-5">
                  <button
                    onClick={async () => {
                      try {
                        setJoiningTripId(trip._id);
                        const currentCount =
                          memberCounts[trip._id] ??
                          (await fetchMemberCount(trip._id));
                        if (
                          typeof trip.maxMembers === "number" &&
                          currentCount !== null &&
                          currentCount >= trip.maxMembers
                        ) {
                          alert("This trip is full.");
                          return;
                        }
                        await apiFetch(`/trips/join/${trip._id}`, {
                          method: "POST",
                        });
                        await fetchMemberCount(trip._id);
                        alert("Joined trip successfully");
                      } catch (err) {
                        alert(err?.message || "Failed to join trip");
                      } finally {
                        setJoiningTripId(null);
                      }
                    }}
                    disabled={
                      joiningTripId === trip._id ||
                      (typeof trip.maxMembers === "number" &&
                        memberCounts[trip._id] >= trip.maxMembers)
                    }
                    className="fg-btn-primary mt-2 text-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {typeof trip.maxMembers === "number" &&
                    memberCounts[trip._id] >= trip.maxMembers
                      ? "Trip full"
                      : joiningTripId === trip._id
                        ? "Joining..."
                        : "Join trip"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default Trips;
