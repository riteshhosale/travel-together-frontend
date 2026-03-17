import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function GpsNavigator() {
  const [searchParams] = useSearchParams();
  const featureName = searchParams.get("feature") || "GPS Navigator";
  const watchIdRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [error, setError] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const hasGeolocation =
    typeof navigator !== "undefined" && "geolocation" in navigator;

  const onLocationSuccess = (coords) => {
    setPosition({
      lat: Number(coords.latitude.toFixed(6)),
      lng: Number(coords.longitude.toFixed(6)),
      accuracy: Math.round(coords.accuracy),
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const getCurrentLocation = () => {
    if (!hasGeolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setIsLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationSuccess(pos.coords);
        setIsLocating(false);
      },
      (geoError) => {
        setError(geoError.message || "Unable to fetch location.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const startTracking = () => {
    if (!hasGeolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setError("");

    if (watchIdRef.current !== null) {
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        onLocationSuccess(pos.coords);
        setIsLocating(false);
      },
      (geoError) => {
        setError(geoError.message || "Live GPS tracking failed.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const mapSrc = useMemo(() => {
    if (!position) {
      return "";
    }

    const delta = 0.02;
    const minLng = position.lng - delta;
    const minLat = position.lat - delta;
    const maxLng = position.lng + delta;
    const maxLat = position.lat + delta;

    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${position.lat}%2C${position.lng}`;
  }, [position]);

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
              {featureName}
            </p>
            <h1 className="fg-title mt-3 text-3xl font-black sm:text-4xl">
              {featureName}
            </h1>
            <p className="fg-muted mt-2 text-sm sm:text-base">
              Use your device GPS to detect your location and open instant
              navigation.
            </p>
          </div>
          <Link to="/" className="fg-btn-secondary text-sm">
            Back to Home
          </Link>
        </div>

        <section className="fg-glass rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={getCurrentLocation}
              className="fg-btn-primary text-sm"
              disabled={isLocating}
            >
              {isLocating ? "Detecting..." : "Use My GPS"}
            </button>
            <button
              onClick={startTracking}
              className="fg-btn-secondary text-sm"
            >
              Start Live Tracking
            </button>
            <button onClick={stopTracking} className="fg-btn-secondary text-sm">
              Stop Tracking
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-300/70 bg-rose-100/70 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {position ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--fg-border)] bg-white/50 p-5">
                <p className="fg-title text-sm font-bold">
                  Current Coordinates
                </p>
                <p className="fg-muted mt-3 text-sm">
                  Latitude: {position.lat}
                </p>
                <p className="fg-muted mt-1 text-sm">
                  Longitude: {position.lng}
                </p>
                <p className="fg-muted mt-1 text-sm">
                  Accuracy: {position.accuracy}m
                </p>
                <p className="fg-muted mt-1 text-sm">
                  Updated: {position.timestamp}
                </p>

                <a
                  href={`https://www.google.com/maps?q=${position.lat},${position.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="fg-btn-primary mt-4 inline-block text-sm"
                >
                  Open in Google Maps
                </a>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[var(--fg-border)] bg-white/60">
                <iframe
                  title="GPS map"
                  src={mapSrc}
                  className="h-[280px] w-full"
                  loading="lazy"
                />
              </div>
            </div>
          ) : (
            <p className="fg-muted mt-5 text-sm">
              Click "Use My GPS" to start location detection.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default GpsNavigator;
