import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SectionHeader from "../components/SectionHeader";
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
            <div className="mb-6 flex justify-center sm:justify-start">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--fg-border)] bg-slate-950/40 p-2 shadow-lg shadow-cyan-500/10">
                <img
                  src="/logo.png"
                  alt="TravelTogether logo"
                  className="h-20 w-20 rounded-full object-cover"
                />
              </div>
            </div>

            <SectionHeader
              kicker="TravelTogether"
              title="Find the right travel partner for your next adventure."
              subtitle="Plan smarter, connect with like-minded travelers, and turn solo ideas into shared experiences with tools built for modern travel."
            />

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
            <SectionHeader
              kicker="How it works"
              title="Plan together in three simple steps"
              subtitle="Everything is designed to help travelers discover trips, coordinate easily, and move faster from idea to itinerary."
            />

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
            <SectionHeader title="Tools that make group travel easier" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  to={feature.to}
                />
              ))}
            </div>
          </section>

          <section id="trust" className="fg-section mt-10 fg-rise">
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionHeader
                kicker="Why choose us"
                title="Built for real travelers, not just demo screens."
                subtitle="TravelTogether focuses on the moments that matter most: finding the right people, keeping plans clear, and making every trip feel easier to manage."
              />
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
            <SectionHeader
              kicker="Ready to explore?"
              title="Start your next journey with the right people."
              subtitle="Create a trip, discover companions, and use AI tools to plan with confidence."
              align="center"
            />
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
