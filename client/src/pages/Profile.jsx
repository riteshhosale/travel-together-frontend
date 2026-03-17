import { useEffect, useState } from "react";
import API from "../services/api";
import { isAuthenticated } from "../services/auth";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        if (!isAuthenticated()) {
          setError("Login required to view profile.");
          return;
        }

        const res = await API.get("/users/profile");

        setProfile(res.data);
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setLocation(res.data.location || "");
      } catch (err) {
        const message =
          err?.response?.data?.message || "Failed to load profile";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    try {
      setIsSaving(true);
      if (!isAuthenticated()) {
        alert("Login required to update profile.");
        return;
      }

      const payload = {
        name,
        email,
        location,
      };
      if (password) {
        payload.password = password;
      }

      const res = await API.put("/users/profile", payload);

      setProfile(res.data);
      setPassword("");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to update profile";
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="fg-glass mx-auto w-full max-w-3xl rounded-3xl p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
            Profile
          </p>
          <h2 className="fg-title mt-3 text-3xl font-bold">Your details</h2>
          <p className="fg-muted mt-2 text-sm">
            Keep your information up to date for better matches.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-300/60 bg-rose-100/70 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="fg-muted text-sm">Loading profile...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="fg-muted text-xs font-semibold">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="fg-input mt-2 text-sm"
              />
            </div>

            <div>
              <label className="fg-muted text-xs font-semibold">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fg-input mt-2 text-sm"
              />
            </div>

            <div>
              <label className="fg-muted text-xs font-semibold">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="fg-input mt-2 text-sm"
              />
            </div>

            <div>
              <label className="fg-muted text-xs font-semibold">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="fg-input mt-2 text-sm"
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={saveProfile}
            disabled={isSaving}
            className="fg-btn-primary text-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          {profile && (
            <div className="fg-muted rounded-xl border border-[var(--fg-border)] px-4 py-3 text-xs">
              Member since:{" "}
              {new Date(profile.createdAt || Date.now()).toDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
