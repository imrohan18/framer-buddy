import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Box,
  Brain,
  Globe2,
  LockKeyhole,
  Menu,
  MousePointer2,
  Layers3,
  Play,
  Sparkles,
  Users,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";

import { StudioShowcase } from "../components/studio-showcase";
import { SiteFooter } from "../components/site-footer";
import { primaryNavigation } from "../lib/site-navigation";

export const Route = createFileRoute("/")({
  component: HyruxHome,
});

/* ============================================================
   CLOUD SVG — fluffy cloud illustration
  ============================================================ */
function CloudSVG({ width = 340, flip = false }: { width?: number; flip?: boolean }) {
  return (
    <svg
      width={width}
      viewBox="0 0 340 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <ellipse cx="170" cy="155" rx="150" ry="45" fill="white" fillOpacity="0.82" />
      <circle cx="80" cy="130" r="55" fill="white" fillOpacity="0.78" />
      <circle cx="160" cy="100" r="72" fill="white" fillOpacity="0.86" />
      <circle cx="255" cy="125" r="58" fill="white" fillOpacity="0.80" />
      <circle cx="200" cy="78" r="42" fill="white" fillOpacity="0.72" />
      <ellipse cx="170" cy="175" rx="130" ry="16" fill="rgba(150,180,210,0.22)" />
    </svg>
  );
}

/* ============================================================
   CALLIGRAPHIC SANSKRIT 'ह' — Based on the custom calligraphy artwork
   ============================================================ */
function CalligraphicHa({
  size = 32,
  color = "currentColor",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 66 90"
      width={size}
      height={Math.round(size * (90 / 66))}
      fill={color}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Top shirorekha bar with calligraphic angle */}
      <path d="M 4,14 L 62,14 C 62,14 60,18.5 56,19.5 L 10,19.5 C 7,19.5 4,17 4,14 Z" />
      {/* Short vertical stem */}
      <path d="M 31,18 L 37,18 L 36,26 L 30,26 Z" />
      {/* Upper hook of ह (sweeps right and curls back inward) */}
      <path d="M 32,24 C 44,24 53,27 52,36 C 51,43 43,45 35,43 C 27,41 23,37 23,36 C 23,36 29,39 36,39 C 43,39 46,36 46,33 C 46,29 38,28 30,28 L 29,24 Z" />
      {/* Sweeping grand crescent lower flourish */}
      <path d="M 35,42 C 22,43 14,48 10,56 C 5,66 9,79 22,85 C 33,90 44,87 49,82 C 50,81 48,80 46,81 C 37,87 23,86 16,78 C 10,70 12,59 23,52 C 30,47 40,49 46,55 C 47,56 48,54 47,53 C 43,47 37,42 35,42 Z" />
    </svg>
  );
}

/* ============================================================
   LOGO — Sanskrit ह mark + HYRUX.in pixel wordmark (Obliq-style)
   ============================================================ */
function HyruxLogo({
  size = "md",
  showMark = false,
  badge = false,
}: {
  size?: "sm" | "md" | "lg";
  showMark?: boolean;
  badge?: boolean;
}) {
  const heights = {
    sm: 28,
    md: 34,
    lg: 46,
  };
  const markSizes = {
    sm: 32,
    md: 38,
    lg: 48,
  };
  const markFonts = {
    sm: "1.18rem",
    md: "1.45rem",
    lg: "1.9rem",
  };

  if (badge) {
    return (
      <a href="/" className="inline-flex items-center" aria-label="Hyrux home">
        <img
          src="/hyrux-logo-card.png"
          alt="हYRUX.in"
          style={{ height: heights[size] + 16, width: "auto", borderRadius: 8 }}
        />
      </a>
    );
  }

  return (
    <a
      href="/"
      className="flex items-center gap-2.5 group"
      aria-label="Hyrux home"
      style={{ textDecoration: "none" }}
    >
      {showMark && (
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: markSizes[size],
            height: markSizes[size],
            borderRadius: 7,
            background: "#0d0d0d",
            color: "#fff",
            fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
            fontSize: markFonts[size],
            fontWeight: 600,
            lineHeight: 1,
            flexShrink: 0,
            transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="group-hover:scale-105"
        >
          ह
        </span>
      )}
      <img
        src="/hyrux-logo-transparent.png"
        alt="हYRUX.in"
        style={{
          height: heights[size],
          width: "auto",
          display: "block",
        }}
      />
    </a>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
function HyruxHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div id="top" style={{ minHeight: "100vh", background: "#C4D8E8" }}>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="hero-band">
        {/* Floating clouds */}
        <div className="hero-cloud-left">
          <CloudSVG width={320} />
        </div>
        <div className="hero-cloud-right">
          <CloudSVG width={290} flip />
        </div>

        {/* Floating dynamic morphing navbar (root-level fixed context for global backdrop blur) */}
        <header className="navbar-wrapper animate-navbar">
          <div className={`nav-pill navbar ${isScrolled ? "is-scrolled" : ""}`}>
            <HyruxLogo size="lg" />
            <nav
              className="hidden items-center nav-links-list md:flex"
              aria-label="Main navigation"
            >
              {primaryNavigation.map(({ label, to }) => (
                <a key={to} href={to} className="nav-link">
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <a href="/careers" className="nav-cta hidden md:inline-flex">
                Join the horizon
              </a>
              <button
                className="md:hidden p-2.5 rounded-full hover:bg-black/5 transition"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className="w-full max-w-[880px] px-4 pointer-events-auto mt-2">
              <nav className="rounded-2xl border border-white/60 bg-white/92 backdrop-blur-xl p-5 md:hidden shadow-2xl">
                {primaryNavigation.map(({ label, to }) => (
                  <a
                    key={to}
                    href={to}
                    className="block py-2.5 text-base font-medium text-foreground hover:opacity-70 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                ))}
                <a href="/careers" className="nav-cta mt-3 w-full justify-center">
                  Join the horizon
                </a>
              </nav>
            </div>
          )}
        </header>

        {/* Hero content */}
        <div className="site-container relative z-10">
          <div className="flex flex-col items-center text-center pt-32 pb-20">
            <h1 className="hero-title animate-rise" style={{ animationDelay: "0.20s" }}>
              Built to Be Seen.
              <br />
              <span style={{ color: "rgba(13,13,13,0.45)" }}>Designed to Be Trusted.</span>
            </h1>
            <p className="hero-copy animate-rise-delay" style={{ animationDelay: "0.32s" }}>
              A digital product &amp; technology studio. We design and build websites, full-stack
              applications, custom software, and AI-powered solutions for businesses that want to
              stand out from the first click.
            </p>
            <div
              className="flex items-center gap-3 mt-9 flex-wrap justify-center animate-rise-delay-2"
              style={{ animationDelay: "0.44s" }}
            >
              <a
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 28px",
                  borderRadius: 999,
                  background: "#0d0d0d",
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontWeight: 650,
                }}
              >
                Start building <ArrowRight size={16} />
              </a>
              <a
                href="/projects"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 28px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#0d0d0d",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              >
                <Play size={14} className="fill-current" /> Explore projects
              </a>
            </div>

            <div className="w-full flex justify-center animate-dashboard" style={{ marginTop: 60 }}>
              <StudioShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────── */}
      <section id="services" className="section-space services-section">
        <div className="site-container">
          <div className="services-heading">
            <div>
              <p className="eyebrow">WHAT WE BUILD</p>
              <h2 className="section-title">
                Digital products, software, and intelligence — built properly.
              </h2>
            </div>
            <div className="services-intro">
              <p>
                One studio for the thinking, design, and engineering behind your next digital
                product. Bring us a challenge; we&apos;ll help shape the right solution.
              </p>
              <a href="/contact" className="services-link">
                Tell us what you&apos;re building <ArrowRight size={15} />
              </a>
            </div>
          </div>
          <div className="services-grid">
            {[
              {
                icon: Globe2,
                title: "Websites",
                copy: "Fast, responsive business websites and marketing sites designed to earn trust from the first visit.",
              },
              {
                icon: Layers3,
                title: "Full-stack applications",
                copy: "Web platforms and portals with clean front ends, reliable back ends, and well-designed APIs.",
              },
              {
                icon: Box,
                title: "Custom software & SaaS",
                copy: "Purpose-built tools and subscription products shaped around how your business actually works.",
              },
              {
                icon: BarChart3,
                title: "Data & business analysis",
                copy: "Dashboards, reporting, and analysis that turn raw data into decisions you can act on.",
              },
              {
                icon: Brain,
                title: "AI / ML solutions",
                copy: "Practical machine-learning and AI features integrated into products where they add real value.",
              },
              {
                icon: Zap,
                title: "Automation & integrations",
                copy: "Connect your tools, remove repetitive work, and keep your systems talking to each other.",
              },
            ].map(({ icon: Icon, title, copy }, index) => (
              <article key={title} className="service-card">
                <div className="service-card-top">
                  <span className="service-icon">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <span className="service-index">0{index + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="service-card-rule" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>



      {/* ── CTA BAND ─────────────────────────────────────────────── */}
      <section
        id="connect"
        className="cta-band"
        style={{ background: "#C4D8E8", position: "relative", overflow: "hidden" }}
      >
        <div
          style={{ position: "absolute", left: -50, top: 10, opacity: 0.65, pointerEvents: "none" }}
        >
          <CloudSVG width={320} />
        </div>
        <div
          style={{
            position: "absolute",
            right: -50,
            top: 50,
            opacity: 0.65,
            pointerEvents: "none",
          }}
        >
          <CloudSVG width={300} flip />
        </div>
        <div
          className="site-container"
          style={{ position: "relative", zIndex: 2, textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-grid",
              placeItems: "center",
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#0d0d0d",
              marginBottom: 32,
              boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
            }}
          >
            <CalligraphicHa size={32} color="#fff" />
          </div>
          <p className="eyebrow" style={{ marginBottom: 16 }}>
            THE HORIZON IS OPEN
          </p>
          <h2
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.03,
              marginBottom: 22,
            }}
          >
            Have a product in mind?
            <br />
            Let&apos;s build it.
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              lineHeight: 1.68,
              color: "rgba(13,13,13,0.65)",
              marginBottom: 36,
              maxWidth: 560,
              marginInline: "auto",
            }}
          >
            Tell us about your idea, your goals, and your timeline. We&apos;ll come back with a
            clear scope and a plan to get it built.
          </p>
          <a
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 999,
              background: "#0d0d0d",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 650,
            }}
          >
            Start a project <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <SiteFooter />
    </div>
  );
}
