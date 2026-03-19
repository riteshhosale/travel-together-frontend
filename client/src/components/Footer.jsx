function Footer() {
  return (
    <footer className="fg-footer mt-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3 sm:px-6">
        <nav className="flex flex-col gap-2">
          <h6 className="fg-title text-xs font-semibold uppercase tracking-[0.2em]">
            Services
          </h6>
          <button type="button" className="fg-nav-link text-xs">
            Branding
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Design
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Marketing
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Advertisement
          </button>
        </nav>
        <nav className="flex flex-col gap-2">
          <h6 className="fg-title text-xs font-semibold uppercase tracking-[0.2em]">
            Company
          </h6>
          <button type="button" className="fg-nav-link text-xs">
            About us
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Contact
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Jobs
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Press kit
          </button>
        </nav>
        <nav className="flex flex-col gap-2">
          <h6 className="fg-title text-xs font-semibold uppercase tracking-[0.2em]">
            Legal
          </h6>
          <button type="button" className="fg-nav-link text-xs">
            Terms of use
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Privacy policy
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Cookie policy
          </button>
        </nav>
        <nav className="flex flex-col gap-2">
          <h6 className="fg-title text-xs font-semibold uppercase tracking-[0.2em]">
            Social
          </h6>
          <button type="button" className="fg-nav-link text-xs">
            Twitter
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Instagram
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Facebook
          </button>
          <button type="button" className="fg-nav-link text-xs">
            GitHub
          </button>
        </nav>
        <nav className="flex flex-col gap-2">
          <h6 className="fg-title text-xs font-semibold uppercase tracking-[0.2em]">
            Explore
          </h6>
          <button type="button" className="fg-nav-link text-xs">
            Features
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Enterprise
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Security
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Pricing
          </button>
        </nav>
        <nav className="flex flex-col gap-2">
          <h6 className="fg-title text-xs font-semibold uppercase tracking-[0.2em]">
            Apps
          </h6>
          <button type="button" className="fg-nav-link text-xs">
            Mac
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Windows
          </button>
          <button type="button" className="fg-nav-link text-xs">
            iPhone
          </button>
          <button type="button" className="fg-nav-link text-xs">
            Android
          </button>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
