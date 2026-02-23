import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { HeroSection } from "@/components/sections/HeroSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const PortfolioSection = lazy(() =>
  import("@/components/sections/PortfolioSection").then((module) => ({
    default: module.PortfolioSection
  }))
);
const AboutSection = lazy(() =>
  import("@/components/sections/AboutSection").then((module) => ({ default: module.AboutSection }))
);
const ContactSection = lazy(() =>
  import("@/components/sections/ContactSection").then((module) => ({ default: module.ContactSection }))
);

/**
 * Renders the portfolio single-page application with all primary sections.
 *
 * @returns The root app component.
 */
export default function App(): JSX.Element {
  return (
    <>
      <Helmet>
        <title>Hernán David Cardona | Full-stack Developer</title>
        <meta
          name="description"
          content="Portfolio of Hernán David Cardona, full-stack developer focused on modern web solutions."
        />
      </Helmet>
      <div className="min-h-screen bg-surface-base text-text-primary">
        <Navbar />
        <main>
          <HeroSection />
          <Suspense
            fallback={<div className="px-5 py-10 text-center text-text-secondary">Loading...</div>}
          >
            <PortfolioSection />
            <AboutSection />
            <ContactSection />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
