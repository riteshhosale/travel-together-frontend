import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Toast from "./components/Toast";
import Chat from "./pages/Chat";
import CreateTrip from "./pages/CreateTrip";
import Feed from "./pages/Feed";
import GpsNavigator from "./pages/GpsNavigator";
import Home from "./pages/Home";
import AI from "./pages/AI";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Reviews from "./pages/Reviews";
import Trips from "./pages/Trips";
import { apiFetch } from "./services/apiFetch";
import { isAuthenticated } from "./services/auth";

function App() {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "info" });

  useEffect(() => {
    const handleNotify = (event) => {
      const detail = event.detail || {};
      setToast({
        message: detail.message || "",
        type: detail.type || "info",
      });
    };

    window.addEventListener("fg:notify", handleNotify);

    return () => {
      window.removeEventListener("fg:notify", handleNotify);
    };
  }, []);

  useEffect(() => {
    if (!toast.message) return undefined;

    const timer = window.setTimeout(() => {
      setToast({ message: "", type: "info" });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!isAuthenticated()) {
        if (isMounted) {
          setIsUserLoading(false);
        }
        return;
      }

      try {
        const data = await apiFetch("/users/profile");

        if (isMounted) {
          setUser(data || null);
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsUserLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthenticated() && isUserLoading && !user) {
    return (
      <div className="fg-page flex min-h-screen items-center justify-center px-6">
        <div className="fg-orb fg-orb-1" />
        <div className="fg-orb fg-orb-2" />
        <div className="fg-orb fg-orb-3" />

        <div className="fg-card fg-loading-shell relative z-10 w-full max-w-lg overflow-hidden p-8 text-center">
          <div className="fg-loading-grid" aria-hidden="true">
            <span className="fg-loading-dot fg-loading-dot-1" />
            <span className="fg-loading-dot fg-loading-dot-2" />
            <span className="fg-loading-dot fg-loading-dot-3" />
          </div>

          <div className="fg-loading-spinner-wrap mx-auto">
            <div className="fg-loading-ring fg-loading-ring-outer" />
            <div className="fg-loading-ring fg-loading-ring-middle" />
            <div className="fg-loading-ring fg-loading-ring-inner" />
            <div className="fg-loading-core">✈</div>
          </div>

          <p className="fg-kicker mt-2 text-xs font-semibold uppercase">TravelTogether</p>
          <h2 className="fg-title mt-4 text-3xl font-bold">Mapping your next adventure</h2>
          <p className="fg-muted mt-3 text-sm">
            Loading your profile, trips, reviews, and community feed...
          </p>

          <div className="fg-loading-progress mt-6" aria-hidden="true">
            <span className="fg-loading-progress-bar" />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-left">
            {[
              "Syncing profile",
              "Fetching trips",
              "Preparing feed",
            ].map((label) => (
              <div key={label} className="fg-loading-pill">
                <span className="fg-loading-pill-dot" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/gps" element={<GpsNavigator />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
