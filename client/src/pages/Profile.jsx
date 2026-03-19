import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import { apiFetch } from "../services/apiFetch";
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

        const data = await apiFetch("/users/profile");

        setProfile(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setLocation(data.location || "");
      } catch (err) {
        setError(err?.message || "Failed to load profile");
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

      const data = await apiFetch("/users/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setProfile(data);
      setPassword("");
    } catch (err) {
      alert(err?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="fg-orb fg-orb-1" aria-hidden="true" />
      <div className="fg-orb fg-orb-2" aria-hidden="true" />
      <div className="fg-page-content mx-auto w-full max-w-3xl fg-rise">
        <div className="fg-section">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="fg-kicker text-xs font-semibold uppercase">
                Profile
              </p>
              <h2 className="fg-title mt-3 text-3xl font-bold">Your details</h2>
              <p className="fg-muted mt-2 text-sm">
                Keep your information up to date for better matches.
              </p>
            </div>
            <BackButton />
          </div>

          {error && (
            <div className="fg-alert mb-6 px-4 py-3 text-sm">{error}</div>
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
                <label className="fg-muted text-xs font-semibold">
                  Location
                </label>
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
              <div className="fg-chip text-xs">
                Member since:{" "}
                {new Date(profile.createdAt || Date.now()).toDateString()}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Profile;
