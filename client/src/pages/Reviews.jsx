import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import { apiFetch } from "../services/apiFetch";

function Reviews() {
  const [trips, setTrips] = useState([]);
  const [tripId, setTripId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTrips = async () => {
      try {
        setIsLoadingTrips(true);
        setError("");
        const data = await apiFetch("/trips");
        setTrips(data);
      } catch (err) {
        setError(err?.message || "Failed to load trips");
      } finally {
        setIsLoadingTrips(false);
      }
    };

    loadTrips();
  }, []);

  const loadReviews = async () => {
    if (!tripId) {
      alert("Choose a trip first.");
      return;
    }

    try {
      setIsLoadingReviews(true);
      const data = await apiFetch(`/reviews/${tripId}`);
      setReviews(data);
    } catch (err) {
      setError(err?.message || "Failed to load reviews");
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const createReview = async () => {
    if (!tripId) {
      alert("Choose a trip first.");
      return;
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      alert("Rating must be between 1 and 5.");
      return;
    }

    try {
      setIsSubmitting(true);
      await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({ tripId, rating: Number(rating), comment }),
      });
      setComment("");
      await loadReviews();
    } catch (err) {
      alert(err?.message || "Failed to add review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="fg-orb fg-orb-1" aria-hidden="true" />
      <div className="fg-orb fg-orb-2" aria-hidden="true" />
      <div className="fg-page-content mx-auto w-full max-w-4xl fg-rise">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="fg-kicker text-xs font-semibold uppercase">Reviews</p>
            <h2 className="fg-title mt-3 text-3xl font-bold">Trip feedback</h2>
            <p className="fg-muted mt-2 text-sm">
              See what travelers think and leave your own review.
            </p>
          </div>
          <BackButton />
        </div>

        <div className="fg-section fg-rise">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="fg-muted text-xs font-semibold">
                Select a trip
              </label>
              <select
                value={tripId}
                onChange={(e) => setTripId(e.target.value)}
                className="fg-input mt-2 text-sm"
              >
                <option value="">Choose trip</option>
                {trips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.destination} ({trip.date})
                  </option>
                ))}
              </select>
              {isLoadingTrips && (
                <p className="fg-muted mt-2 text-xs">Loading trips...</p>
              )}
            </div>

            <div>
              <label className="fg-muted text-xs font-semibold">Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="fg-input mt-2 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="fg-muted text-xs font-semibold">Comment</label>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience"
                className="fg-input mt-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={loadReviews}
              className="fg-btn-secondary text-sm transition hover:border-cyan-300 hover:text-cyan-600"
            >
              Load reviews
            </button>
            <button
              onClick={createReview}
              disabled={isSubmitting}
              className="fg-btn-primary text-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Posting..." : "Add review"}
            </button>
          </div>
        </div>

        {error && (
          <div className="fg-alert mt-6 px-4 py-3 text-sm">{error}</div>
        )}

        <div className="mt-8 space-y-4">
          {isLoadingReviews ? (
            <p className="fg-muted text-sm">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="fg-card border-dashed p-6 text-center text-sm fg-muted">
              No reviews yet.
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="fg-card p-6">
                <p className="fg-title text-sm font-semibold">
                  Rating: {review.rating}/5
                </p>
                <p className="fg-muted mt-2 text-sm">
                  {review.comment || "No comment provided."}
                </p>
              </div>
            ))
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Reviews;
