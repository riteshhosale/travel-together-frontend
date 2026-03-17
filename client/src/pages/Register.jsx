import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const featureName = searchParams.get("feature") || "Create Account";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = async () => {
    if (!name || !email || !password) {
      alert("Name, email, and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      await API.post("/auth/register", {
        name,
        email,
        password,
        location,
      });

      alert("User registered. Please login.");
      navigate("/login");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Registration failed. Try again.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="fg-glass mx-auto w-full max-w-md rounded-3xl p-8">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
            {featureName}
          </p>
          <h2 className="fg-title mt-3 text-3xl font-bold">{featureName}</h2>
          <p className="fg-muted mt-2 text-sm">
            Find travel partners who match your vibe.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="fg-muted text-xs font-semibold">Full name</label>
            <input
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="fg-input mt-2 text-sm"
            />
          </div>

          <div>
            <label className="fg-muted text-xs font-semibold">
              Email address
            </label>
            <input
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="fg-input mt-2 text-sm"
            />
          </div>

          <div>
            <label className="fg-muted text-xs font-semibold">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="fg-input mt-2 text-sm"
            />
          </div>

          <div>
            <label className="fg-muted text-xs font-semibold">Home base</label>
            <input
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="fg-input mt-2 text-sm"
            />
          </div>
        </div>

        <button
          onClick={register}
          disabled={isSubmitting}
          className="fg-btn-primary mt-6 w-full text-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}

export default Register;
