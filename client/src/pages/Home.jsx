import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Stats from "../components/Stats";

function Home() {
  const features = [
    {
      title: "MirrorTrip Chat",
      description: "Coordinate plans, updates, and shared moments with your trip group in one place.",
      to: "/chat?feature=MirrorTrip",
    },
    {
      title: "GPS Navigator",
      description: "Open trip-friendly navigation tools and stay on the right route.",
      to: "/gps",
    },
    {
      title: "TravelGPT Assistant",
      description: "Ask anything about routes, trip plans, places, and travel ideas.",
      to: "/ai?feature=TravelGPT%20Assistant",
    },
  ];

  const steps = [
    {
      title: "Create or explore trips",
      description: "Start your own plan or browse trips shared by other travelers.",
    },
    {
      title: "Find the right companions",
      description: "Match by destination, timing, budget, and travel vibe.",
    },
    {
      title: "Plan together",
      description: "Use group chat and AI tools to make the trip smoother.",
    },
  ];

  const trustPoints = [
    "Trip discovery with clear dates and budgets",
    "AI help for planning and packing",
    "Built-in trip chat for coordination",
    "Simple flow designed for mobile users",
  ];

  return (
    <div className="fg-page min-h-screen">
      <div className="fg-orb fg-orb-1" aria-hidden="true" />
      <div className="fg-orb fg-orb-2" aria-hidden="true" />
      <div className="fg-orb fg-orb-3" aria-hidden="true" />
      <div className="fg-page-content">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-end">
            <BackButton />
          </div>

          <section id="home" className="fg-section fg-rise">
            <p className="fg-kicker text-xs font-semibold uppercase">
              TravelTogether
            </p>
            <h1 className="fg-title mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
              Find the right travel partner for your next adventure.
            </h1>
            <p className="fg-muted mt-5 max-w-3xl text-base sm:text-lg">
              Plan smarter, connect with like-minded travelers, and turn solo ideas
              into shared experiences with tools built for modern travel.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/create-trip"
                className="fg-btn-primary text-center text-sm transition hover:brightness-110"
              >
                Create a Trip
              </Link>
              <Link
                to="/trips"
                className="fg-btn-secondary text-center text-sm transition hover:border-cyan-300 hover:text-cyan-600"
              >
                Explore Trips
              </Link>
            </div>
          </section>

          <section id="stats" className="pt-10">
            <Stats />
          </section>

          <section id="how-it-works" className="fg-section mt-10 fg-rise">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="fg-kicker text-xs font-semibold uppercase">How it works</p>
                <h2 className="fg-title text-3xl font-black sm:text-4xl">
                  Plan together in three simple steps
                </h2>
              </div>
              <p className="fg-muted max-w-2xl text-sm sm:text-base">
                Everything is designed to help travelers discover trips, coordinate
                easily, and move faster from idea to itinerary.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <article key={step.title} className="fg-card p-6">
                  <p className="fg-kicker text-xs font-semibold uppercase">0{index + 1}</p>
                  <h3 className="fg-title mt-3 text-xl font-bold">{step.title}</h3>
                  <p className="fg-muted mt-3 text-sm">{step.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="features" className="fg-section mt-10 fg-rise">
            <h2 className="fg-title text-3xl font-black sm:text-4xl">
              Tools that make group travel easier
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="fg-card p-5">
                  <h3 className="fg-title text-base font-bold">{feature.title}</h3>
                  <p className="fg-muted mt-2 text-sm">{feature.description}</p>
                  <Link
                    to={feature.to}
                    className="fg-btn-secondary mt-4 inline-block text-sm"
                  >
                    Open Feature
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section id="trust" className="fg-section mt-10 fg-rise">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <p className="fg-kicker text-xs font-semibold uppercase">Why choose us</p>
                <h2 className="fg-title mt-3 text-3xl font-black sm:text-4xl">
                  Built for real travelers, not just demo screens.
                </h2>
                <p className="fg-muted mt-4 text-sm sm:text-base">
                  TravelTogether focuses on the moments that matter most: finding
                  the right people, keeping plans clear, and making every trip feel
                  easier to manage.
                </p>
              </div>
              <div className="grid gap-4">
                {trustPoints.map((item) => (
                  <div key={item} className="fg-card p-5">
                    <p className="fg-title text-base font-semibold">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="fg-section mt-10 text-center fg-rise">
            <p className="fg-kicker text-xs font-semibold uppercase">Ready to explore?</p>
            <h2 className="fg-title mt-3 text-3xl font-black sm:text-4xl">
              Start your next journey with the right people.
            </h2>
            <p className="fg-muted mx-auto mt-4 max-w-2xl text-sm sm:text-base">
              Create a trip, discover companions, and use AI tools to plan with confidence.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/create-trip" className="fg-btn-primary text-sm">
                Start Your Journey
              </Link>
              <Link to="/ai?feature=TravelGPT%20Assistant" className="fg-btn-secondary text-sm">
                Try TravelGPT
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
