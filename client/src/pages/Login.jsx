import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setToken } from "../services/auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = location.state?.from || "/";

  const login = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const rawBase =
        process.env.REACT_APP_API_URL ||
        "https://travel-together-backend.onrender.com";
      const base = rawBase.replace(/\/+$/, "");
      const apiBase = base.endsWith("/api") ? base : `${base}/api`;

      const response = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Login failed. Try again.");
      }

      setToken(data.token);

      alert("Login successful");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      alert(err?.message || "Login failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="fg-glass mx-auto w-full max-w-md rounded-3xl p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
            Welcome back
          </p>
          <h2 className="fg-title mt-3 text-3xl font-bold">Sign in</h2>
          <p className="fg-muted mt-2 text-sm">
            Resume planning your next adventure.
          </p>
        </div>

        <div className="space-y-4">
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
        </div>

        <button
          onClick={login}
          disabled={isSubmitting}
          className="fg-btn-primary mt-6 w-full text-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
