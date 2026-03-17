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
        <Link to="/" className="fg-title text-lg font-bold">
          TravelTogether
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <NavLink to="/trips" className="fg-muted hover:text-cyan-600">
            Trips
          </NavLink>
          <NavLink to="/feed" className="fg-muted hover:text-cyan-600">
            Feed
          </NavLink>
          <NavLink to="/chat" className="fg-muted hover:text-cyan-600">
            Chat
          </NavLink>
          <NavLink to="/gps" className="fg-muted hover:text-cyan-600">
            GPS
          </NavLink>
          <NavLink to="/reviews" className="fg-muted hover:text-cyan-600">
            Reviews
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {authed ? (
            <>
              <Link to="/profile" className="fg-btn-secondary text-xs">
                Profile
              </Link>
              <button onClick={handleLogout} className="fg-btn-primary text-xs">
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
    </header>
  );
}

export default Navbar;
