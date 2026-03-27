import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import { apiFetch } from "../services/apiFetch";
import { isAuthenticated } from "../services/auth";
import { notify } from "../services/notify";

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
        notify({ message: "Login required to update profile.", type: "error" });
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
      notify({ message: "Profile updated.", type: "success" });
    } catch (err) {
      notify({ message: err?.message || "Failed to update profile", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="fg-orb fg-orb-1" aria-hidden="true" />
      <div className="fg-orb fg-orb-2" aria-hidden="true" />
      <div className="fg-page-content mx-auto w-full max-w-6xl fg-rise">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-6">
            <div className="fg-card p-6">
              <div className="flex items-center gap-4">
                <div className="fg-profile-avatar">
                  {(name || profile?.name || "U").slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="fg-kicker text-xs font-semibold uppercase">Profile</p>
                  <h2 className="fg-title mt-2 text-2xl font-bold">
                    {name || profile?.name || "Traveler"}
                  </h2>
                  <p className="fg-muted mt-1 text-sm">{email || profile?.email || "No email"}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="fg-card p-4">
                  <p className="fg-muted text-xs font-semibold uppercase tracking-[0.22em]">
                    Home base
                  </p>
                  <p className="fg-title mt-2 text-sm font-semibold">
                    {location || profile?.location || "Not added yet"}
                  </p>
                </div>
                <div className="fg-card p-4">
                  <p className="fg-muted text-xs font-semibold uppercase tracking-[0.22em]">
                    Member since
                  </p>
                  <p className="fg-title mt-2 text-sm font-semibold">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toDateString()
                      : "Recently joined"}
                  </p>
                </div>
              </div>
            </div>

            <div className="fg-card p-6">
              <p className="fg-title text-lg font-bold">Profile quality tip</p>
              <p className="fg-muted mt-3 text-sm leading-7">
                Clean, complete profile details help create more trust and make your trip
                posts feel more credible to other travelers.
              </p>
            </div>
          </aside>

          <section className="fg-section">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="fg-kicker text-xs font-semibold uppercase">Account settings</p>
                <h2 className="fg-title mt-4 text-4xl font-black">Your details</h2>
                <p className="fg-muted mt-3 max-w-xl text-sm leading-7 sm:text-base">
                  Keep your information current so your profile looks more professional and
                  helps future travel matches make faster decisions.
                </p>
              </div>
              <BackButton />
            </div>

            {error && <div className="fg-alert mb-6 px-4 py-3 text-sm">{error}</div>}

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
                  <label className="fg-muted text-xs font-semibold">New password</label>
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
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Profile;
