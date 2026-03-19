import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Stats from "../components/Stats";

function Home() {
  const features = [
    {
      title: "MirrorTrip",
      description: "Coordinate with trip partners in real-time chat rooms.",
      to: "/chat?feature=MirrorTrip",
    },
    {
      title: "AI Luggage Manager",
      description: "Build destination-specific luggage recommendations.",
      to: "/ai?feature=AI%20Luggage%20Manager",
    },
    {
      title: "TravelGPT Assistant",
      description: "Ask travel questions and get AI planning help.",
      to: "/ai?feature=TravelGPT%20Assistant",
    },
  ];

  return (
    <div className="fg-page min-h-screen">
      <div className="fg-orb fg-orb-1" aria-hidden="true" />
      <div className="fg-orb fg-orb-2" aria-hidden="true" />
      <div className="fg-orb fg-orb-3" aria-hidden="true" />
      <div className="fg-page-content">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <section id="home" className="fg-section fg-rise">
            <p className="fg-kicker text-xs font-semibold uppercase">
              TravelTogether
            </p>
            <h1 className="fg-title mt-4 text-4xl font-black leading-tight sm:text-6xl">
              AI-powered travel planning for meaningful travel experiences.
            </h1>
            <p className="fg-muted mt-5 max-w-2xl text-base sm:text-lg">
              Find compatible companions, build dream routes, and coordinate
              every moment with smart tools built for modern explorers.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/create-trip"
                className="fg-btn-primary text-center text-sm transition hover:brightness-110"
              >
                Start Your Journey
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

          <section id="features" className="fg-section mt-10 fg-rise">
            <h2 className="fg-title text-3xl font-black sm:text-4xl">
              Revolutionary Features
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="fg-card p-5">
                  <h3 className="fg-title text-base font-bold">
                    {feature.title}
                  </h3>
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
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
