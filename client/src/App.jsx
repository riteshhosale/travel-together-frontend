import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
    return <div>Loading...</div>;
  }

  return (
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
  );
}

export default App;
