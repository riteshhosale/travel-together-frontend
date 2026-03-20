import { useState } from "react";
import Footer from "../components/Footer";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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

      const rawBase =
        process.env.REACT_APP_API_URL ||
        "https://travel-together-backend.onrender.com";
      const base = rawBase.replace(/\/+$/, "");
      const apiBase = base.endsWith("/api") ? base : `${base}/api`;

      const response = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Registration failed. Try again.");
      }

      alert("User registered. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err?.message || "Registration failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fg-page min-h-screen px-4 py-10 sm:py-12">
      <div className="fg-orb fg-orb-1" aria-hidden="true" />
      <div className="fg-orb fg-orb-2" aria-hidden="true" />
      <div className="fg-page-content mx-auto w-full max-w-md fg-rise">
        <div className="fg-section">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="fg-kicker text-xs font-semibold uppercase">{featureName}</p>
              <h2 className="fg-title mt-3 text-3xl font-bold">Create your account</h2>
              <p className="fg-muted mt-2 text-sm">
                Join TravelTogether and start planning with people who match your vibe.
              </p>
            </div>
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
              <label className="fg-muted text-xs font-semibold">Email address</label>
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
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

          <p className="fg-muted mt-5 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="fg-title font-semibold">
              Sign in
            </Link>
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Register;
