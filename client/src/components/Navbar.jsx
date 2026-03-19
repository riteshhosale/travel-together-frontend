import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearToken, isAuthenticated } from "../services/auth";

function Navbar() {
  const navigate = useNavigate();
  const authed = isAuthenticated();

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  return (
    <header className="fg-glass sticky top-0 z-10 border-b border-[var(--fg-border)] px-4 py-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="TravelTogether logo"
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="fg-title text-lg font-bold tracking-wide">
            TravelTogether
          </span>
        </Link>
        <div className="ml-auto flex flex-wrap items-center gap-4 text-sm">
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <NavLink
              to="/trips"
              className={({ isActive }) =>
                `fg-nav-link ${isActive ? "fg-nav-link-active" : ""}`
              }
            >
              Trips
            </NavLink>
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `fg-nav-link ${isActive ? "fg-nav-link-active" : ""}`
              }
            >
              Feed
            </NavLink>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `fg-nav-link ${isActive ? "fg-nav-link-active" : ""}`
              }
            >
              Chat
            </NavLink>
            <NavLink
              to="/gps"
              className={({ isActive }) =>
                `fg-nav-link ${isActive ? "fg-nav-link-active" : ""}`
              }
            >
              GPS
            </NavLink>
            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                `fg-nav-link ${isActive ? "fg-nav-link-active" : ""}`
              }
            >
              Reviews
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            {authed ? (
              <>
                <Link to="/profile" className="fg-btn-secondary text-xs">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="fg-btn-primary text-xs"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="fg-btn-secondary text-xs">
                  Login
                </Link>
                <Link to="/register" className="fg-btn-primary text-xs">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
