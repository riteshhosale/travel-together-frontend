import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="fg-footer mt-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div className="space-y-3">
          <h6 className="fg-title text-xs font-semibold uppercase tracking-[0.2em]">
            TravelTogether
          </h6>
          <p className="fg-muted text-sm">
            Find travel partners, plan together, and use smart tools to make every trip easier.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          <h6 className="fg-title text-xs font-semibold uppercase tracking-[0.2em]">
            Explore
          </h6>
          <Link to="/" className="fg-nav-link text-sm">Home</Link>
          <Link to="/trips" className="fg-nav-link text-sm">Trips</Link>
          <Link to="/create-trip" className="fg-nav-link text-sm">Create Trip</Link>
          <Link to="/feed" className="fg-nav-link text-sm">Feed</Link>
        </nav>

        <nav className="flex flex-col gap-2">
          <h6 className="fg-title text-xs font-semibold uppercase tracking-[0.2em]">
            Smart tools
          </h6>
          <Link to="/ai?feature=TravelGPT%20Assistant" className="fg-nav-link text-sm">
            TravelGPT Assistant
          </Link>
          <Link to="/gps" className="fg-nav-link text-sm">
            GPS Navigator
          </Link>
          <Link to="/chat" className="fg-nav-link text-sm">Trip Chat</Link>
          <Link to="/reviews" className="fg-nav-link text-sm">Reviews</Link>
        </nav>

        <div className="space-y-2">
          <h6 className="fg-title text-xs font-semibold uppercase tracking-[0.2em]">
            Trust
          </h6>
          <p className="fg-muted text-sm">Built for cleaner planning, simpler coordination, and better shared travel experiences.</p>
          <p className="fg-muted text-xs">© 2026 TravelTogether. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
