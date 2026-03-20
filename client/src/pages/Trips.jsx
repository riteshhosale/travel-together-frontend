import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    if (Array.isArray(payload)) return payload.length;
    if (payload && Array.isArray(payload.members)) return payload.members.length;
    if (payload && typeof payload.count === "number") return payload.count;
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
        await Promise.all((data || []).map((trip) => fetchMemberCount(trip._id)));
      } catch (err) {
        setError(err?.message || "Failed to load trips");
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, [fetchMemberCount]);

  return (
    <div className="fg-page min-h-screen px-4 py-10 sm:py-12">
      <div className="fg-orb fg-orb-1" aria-hidden="true" />
      <div className="fg-orb fg-orb-2" aria-hidden="true" />
      <div className="fg-page-content mx-auto w-full max-w-6xl fg-rise">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="fg-kicker text-xs font-semibold uppercase">Explore trips</p>
            <h2 className="fg-title mt-3 text-3xl font-bold sm:text-4xl">Available trips</h2>
            <p className="fg-muted mt-2 max-w-2xl text-sm sm:text-base">
              Discover shared journeys, compare destinations, and join trips that fit your timing and budget.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <BackButton />
            <span className="fg-chip text-xs font-semibold">{trips.length} trips</span>
            <Link to="/create-trip" className="fg-btn-secondary text-xs">
              Create trip
            </Link>
          </div>
        </div>

        {error && <div className="fg-alert mb-6 px-4 py-3 text-sm">{error}</div>}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={`loading-${index}`} className="fg-card p-6">
                <div className="h-6 w-1/2 rounded-full bg-slate-800/70" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="h-6 w-24 rounded-full bg-slate-800/70" />
                  <div className="h-6 w-28 rounded-full bg-slate-800/70" />
                  <div className="h-6 w-24 rounded-full bg-slate-800/70" />
                </div>
                <div className="mt-4 h-4 w-full rounded-full bg-slate-800/70" />
                <div className="mt-2 h-4 w-4/5 rounded-full bg-slate-800/70" />
                <div className="mt-5 h-10 w-32 rounded-full bg-slate-800/70" />
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="fg-card border-dashed p-8 text-center">
            <h3 className="fg-title text-xl font-bold">No trips yet</h3>
            <p className="fg-muted mt-3 text-sm">
              Be the first to share your destination and start planning with others.
            </p>
            <Link to="/create-trip" className="fg-btn-primary mt-6 text-sm">
              Create your first trip
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {trips.map((trip) => {
              const memberCount = memberCounts[trip._id];
              const isFull =
                typeof trip.maxMembers === "number" && memberCount >= trip.maxMembers;

              return (
                <div
                  key={trip._id}
                  className="fg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="fg-title text-xl font-semibold">{trip.destination}</h3>
                      <p className="fg-muted mt-2 text-sm">
                        {trip.description || "A shared trip waiting for the right travel companions."}
                      </p>
                    </div>
                    <span className="fg-chip text-[11px] font-semibold uppercase tracking-wide">
                      Open
                    </span>
                  </div>

                  <div className="fg-muted mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="fg-chip">Date: {trip.date}</span>
                    <span className="fg-chip">Budget: {trip.budget || "Flexible"}</span>
                    <span className="fg-chip">
                      Members: {memberCount ?? "--"}
                      {trip.maxMembers ? ` / ${trip.maxMembers}` : ""}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={async () => {
                        try {
                          setJoiningTripId(trip._id);
                          const currentCount = memberCount ?? (await fetchMemberCount(trip._id));
                          if (
                            typeof trip.maxMembers === "number" &&
                            currentCount !== null &&
                            currentCount >= trip.maxMembers
                          ) {
                            alert("This trip is full.");
                            return;
                          }
                          await apiFetch(`/trips/join/${trip._id}`, { method: "POST" });
                          await fetchMemberCount(trip._id);
                          alert("Joined trip successfully");
                        } catch (err) {
                          alert(err?.message || "Failed to join trip");
                        } finally {
                          setJoiningTripId(null);
                        }
                      }}
                      disabled={joiningTripId === trip._id || isFull}
                      className="fg-btn-primary text-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isFull
                        ? "Trip full"
                        : joiningTripId === trip._id
                          ? "Joining..."
                          : "Join trip"}
                    </button>
                    <Link to="/chat" className="fg-btn-secondary text-sm">
                      Open chat
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default Trips;
