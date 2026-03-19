function Footer() {
  return (
    <footer className="fg-footer mt-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
        <div>
          <p className="fg-title text-sm font-semibold">TravelTogether</p>
          <p className="fg-muted mt-1 text-xs">
            Plan, connect, and travel with confidence.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <a href="#" className="fg-nav-link">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
