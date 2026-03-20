import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { apiFetch } from "../services/apiFetch";

function AI() {
  const [searchParams] = useSearchParams();
  const requestedFeature = searchParams.get("feature") || "TravelGPT Assistant";
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const mode = useMemo(
    () => (requestedFeature.toLowerCase().includes("luggage") ? "luggage" : "trip-plan"),
    [requestedFeature],
  );

  const title = mode === "luggage" ? "AI Luggage Manager" : "TravelGPT Assistant";
  const buttonText = mode === "luggage" ? "Generate checklist" : "Generate plan";
  const promptIdeas =
    mode === "luggage"
      ? ["Goa", "Manali", "Shimla", "Kerala"]
      : ["Goa", "Jaipur", "Udaipur", "Manali"];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await apiFetch(`/ai/${mode}`, {
        method: "POST",
        body: JSON.stringify({ destination }),
      });
      setResult(data);
    } catch (err) {
      setError(err?.message || "Failed to fetch AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fg-page min-h-screen">
      <div className="fg-orb fg-orb-1" aria-hidden="true" />
      <div className="fg-orb fg-orb-2" aria-hidden="true" />
      <div className="fg-orb fg-orb-3" aria-hidden="true" />
      <div className="fg-page-content">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-end">
            <BackButton />
          </div>

          <section className="fg-section fg-rise">
            <p className="fg-kicker text-xs font-semibold uppercase">AI tools</p>
            <h1 className="fg-title mt-4 text-4xl font-black leading-tight sm:text-6xl">
              {title}
            </h1>
            <p className="fg-muted mt-5 max-w-3xl text-base sm:text-lg">
              {mode === "luggage"
                ? "Get a quick, destination-based packing checklist so you forget less and travel lighter."
                : "Ask for a quick travel plan and get a simple day-wise outline for your destination."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder={mode === "luggage" ? "Enter destination for packing list" : "Enter destination for travel plan"}
                className="fg-input"
              />
              <button
                type="submit"
                disabled={loading || !destination.trim()}
                className="fg-btn-primary text-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Loading..." : buttonText}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-3">
              {promptIdeas.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  className="fg-btn-secondary text-xs"
                  onClick={() => setDestination(idea)}
                >
                  {idea}
                </button>
              ))}
            </div>

            {error && <div className="fg-alert mt-6 px-4 py-3 text-sm">{error}</div>}

            {result && (
              <div className="fg-card mt-6 p-6">
                {result.destination && (
                  <p className="fg-muted text-sm">Destination: {result.destination}</p>
                )}

                {typeof result.days === "number" && (
                  <div className="mt-4 inline-block rounded-full border border-[var(--fg-border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide">
                    {result.days} day plan
                  </div>
                )}

                {Array.isArray(result.activities) && (
                  <div className="mt-5">
                    <h2 className="fg-title text-xl font-bold">Suggested plan</h2>
                    <ul className="fg-muted mt-3 space-y-3 text-sm">
                      {result.activities.map((item, index) => (
                        <li key={`${item}-${index}`}>
                          <span className="fg-title font-semibold">Day {index + 1}:</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(result.items) && (
                  <div className="mt-5">
                    <h2 className="fg-title text-xl font-bold">Packing checklist</h2>
                    <ul className="fg-muted mt-3 grid gap-3 sm:grid-cols-2 text-sm">
                      {result.items.map((item, index) => (
                        <li key={`${item}-${index}`} className="fg-card px-4 py-3">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="fg-section mt-10 fg-rise">
            <h2 className="fg-title text-3xl font-black sm:text-4xl">
              What this tool helps with
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="fg-card p-5">
                <h3 className="fg-title text-base font-bold">Quick planning</h3>
                <p className="fg-muted mt-2 text-sm">
                  Generate a simple trip outline without spending time researching from scratch.
                </p>
              </article>
              <article className="fg-card p-5">
                <h3 className="fg-title text-base font-bold">Smarter packing</h3>
                <p className="fg-muted mt-2 text-sm">
                  Get an instant checklist for essentials before you leave.
                </p>
              </article>
              <article className="fg-card p-5">
                <h3 className="fg-title text-base font-bold">Better decisions</h3>
                <p className="fg-muted mt-2 text-sm">
                  Use AI support to move faster from destination idea to actual trip plan.
                </p>
              </article>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default AI;
