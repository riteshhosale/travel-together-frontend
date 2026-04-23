import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Toast from "./components/Toast";
import { NOTIFY_EVENT } from "./services/notify";

const Home = lazy(() => import("./pages/Home"));
const Trips = lazy(() => import("./pages/Trips"));
const CreateTrip = lazy(() => import("./pages/CreateTrip"));
const Feed = lazy(() => import("./pages/Feed"));
const AI = lazy(() => import("./pages/AI"));
const Chat = lazy(() => import("./pages/Chat"));
const GpsNavigator = lazy(() => import("./pages/GpsNavigator"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function RouteFallback() {
  return (
    <div className="fg-page flex min-h-[40vh] items-center justify-center px-6">
      <div className="fg-card p-6 text-center">
        <p className="fg-muted text-sm">Loading page...</p>
      </div>
    </div>
  );
}

function App() {
  const [toast, setToast] = useState({ message: "", type: "info" });

  useEffect(() => {
    const handleNotify = (event) => {
      const detail = event.detail || {};
      setToast({
        message: detail.message || "",
        type: detail.type || "info",
      });
    };

    window.addEventListener(NOTIFY_EVENT, handleNotify);

    return () => {
      window.removeEventListener(NOTIFY_EVENT, handleNotify);
    };
  }, []);

  useEffect(() => {
    if (!toast.message) return undefined;

    const timer = window.setTimeout(() => {
      setToast({ message: "", type: "info" });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </>
  );
}

export default App;
