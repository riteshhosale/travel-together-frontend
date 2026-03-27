import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearToken, isAuthenticated } from "../services/auth";

function Navbar() {
  const navigate = useNavigate();
  const authed = isAuthenticated();

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Trips", to: "/trips" },
    { label: "Feed", to: "/feed" },
    { label: "Chat", to: "/chat" },
    { label: "AI", to: "/ai" },
    { label: "Reviews", to: "/reviews" },
  ];

  return (
    <header className="fg-navbar sticky top-0 z-30 px-4 py-4 sm:px-6 lg:px-8">
      <div className="fg-navbar-shell mx-auto flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="fg-logo-mark">
              <img
                src="/logo.png"
                alt="TravelTogether logo"
                className="h-10 w-10 rounded-2xl object-cover"
              />
            </div>
            <div>
              <span className="fg-title block text-lg font-bold tracking-wide">
                TravelTogether
              </span>
              <span className="fg-muted text-xs">Professional trip planning, together</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
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

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
          <nav className="fg-nav-wrap flex flex-wrap items-center gap-2 text-sm sm:gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `fg-nav-pill ${isActive ? "fg-nav-pill-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
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
      </div>
    </header>
  );
}

export default Navbar;
