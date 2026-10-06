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
import { useState, useEffect, useRef } from "react";

import { PricingSection } from "../components/pricing-section";
import { listPublishedProjectsFn } from "../lib/cms/server-fns";

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
   PRODUCT DASHBOARD MOCKUP
   ============================================================ */
function HyruxDashboard() {
  return (
    <div
      className="dashboard-shell animate-dashboard"
      aria-label="Hyrux creator dashboard preview"
      style={{ maxWidth: 900, marginInline: "auto" }}
    >
      {/* Top bar */}
      <div className="dash-topbar">
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <HyruxLogo size="sm" />
        <div style={{ flex: 1, marginLeft: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              background: "rgba(0,0,0,0.04)",
              borderRadius: 6,
              maxWidth: 240,
              fontSize: "0.72rem",
              color: "rgba(13,13,13,0.4)",
            }}
          >
            <span>🔍</span> Search products, orders…
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#C4D8E8,#B0CBE0)",
              border: "2px solid #fff",
            }}
          />
        </div>
      </div>

      {/* Main layout */}
      <div
        className="dash-main-layout"
        style={{ display: "grid", gridTemplateColumns: "196px 1fr", minHeight: 400 }}
      >
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <p
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(13,13,13,0.32)",
              padding: "6px 12px 4px",
            }}
          >
            WORKSPACE
          </p>
          {[
            [Layers3, "Overview", true],
            [WandSparkles, "Studio", false],
            [LockKeyhole, "Vault", false],
            [Box, "Hub", false],
            [BarChart3, "Insights", false],
          ].map(([Icon, label, active]) => {
            const NavIcon = Icon as typeof Layers3;
            return (
              <div key={label as string} className={`dash-nav ${active ? "dash-nav-active" : ""}`}>
                <NavIcon size={14} />
                <span>{label as string}</span>
              </div>
            );
          })}
          <p
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(13,13,13,0.32)",
              padding: "14px 12px 4px",
            }}
          >
            COMING SOON
          </p>
          <div className="dash-nav">
            <Users size={14} />
            <span>Connect</span>
          </div>
          <div style={{ marginTop: "auto", padding: "14px 12px 4px" }}>
            <div
              style={{
                background: "linear-gradient(135deg,#C4D8E8 0%,#D8EAF4 100%)",
                borderRadius: 8,
                padding: "12px 14px",
              }}
            >
              <p style={{ fontSize: "0.72rem", fontWeight: 650 }}>Upgrade to Pro</p>
              <p style={{ fontSize: "0.65rem", color: "rgba(13,13,13,0.55)", marginTop: 4 }}>
                Unlock global payouts &amp; AI features.
              </p>
              <div
                style={{
                  marginTop: 10,
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: "#0d0d0d",
                  color: "#fff",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  display: "inline-block",
                }}
              >
                Upgrade
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="dashboard-main">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <div>
              <p style={{ fontSize: "0.72rem", color: "rgba(13,13,13,0.4)" }}>
                Good morning, Creator
              </p>
              <p style={{ fontSize: "1rem", fontWeight: 650, marginTop: 2 }}>
                Your digital business
              </p>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 16px",
                borderRadius: 999,
                background: "#0d0d0d",
                color: "#fff",
                fontSize: "0.78rem",
                fontWeight: 600,
              }}
            >
              <Sparkles size={13} /> Create new
            </div>
          </div>

          {/* Metrics */}
          <div
            className="dash-metrics-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {[
              { label: "Revenue", icon: "💰", value: "$24,860", change: "+18.4%", pos: true },
              { label: "Customers", icon: "👥", value: "1,248", change: "+9.2%", pos: true },
              { label: "Conversion", icon: "📈", value: "7.8%", change: "+2.1%", pos: true },
            ].map((s) => (
              <div className="metric" key={s.label}>
                <p>
                  <span>{s.icon}</span> {s.label}
                </p>
                <strong>{s.value}</strong>
                <span className="pos">{s.change}</span>
              </div>
            ))}
          </div>

          {/* Charts + table */}
          <div
            className="dash-insights-grid"
            style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 10 }}
          >
            <div className="dash-panel">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <h4>REVENUE GROWTH</h4>
                <span className="dash-chip">Last 6 months</span>
              </div>
              <div className="chart-bars">
                {[38, 55, 43, 74, 61, 88, 68, 95, 82, 108, 98, 126].map((height, i) => (
                  <i key={i} style={{ height }} />
                ))}
              </div>
            </div>
            <div className="dash-panel">
              <h4>TOP PRODUCTS</h4>
              <div style={{ marginTop: 10 }}>
                {[
                  ["Creator OS", "84%", "#22c55e"],
                  ["Design Kit", "68%", "#3B82F6"],
                  ["Launch Course", "52%", "#F0B429"],
                ].map(([name, pct, color]) => (
                  <div key={name} style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.7rem",
                        marginBottom: 4,
                      }}
                    >
                      <span>{name}</span>
                      <span style={{ fontWeight: 650 }}>{pct}</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(0,0,0,0.06)", borderRadius: 999 }}>
                      <div
                        style={{ height: "100%", width: pct, background: color, borderRadius: 999 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type HomeProject = Awaited<ReturnType<typeof listPublishedProjectsFn>>[number];

const proofLabels = [
  "WEBSITES",
  "FULL-STACK APPS",
  "CUSTOM SOFTWARE",
  "DATA & ANALYTICS",
  "AI / ML",
  "AUTOMATION",
];

const navItems = [
  ["Projects", "/projects"],
  ["Vision", "/about"],
  ["Pricing", "/pricing"],
  ["Blog", "/blog"],
  ["Join Us", "/contact"],
];

function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, isVisible]);

  return [ref, isVisible] as const;
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
function HyruxHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedWorkRef, selectedWorkVisible] = useReveal<HTMLElement>(0.15);
  const [selectedWorkProofRef, selectedWorkProofVisible] = useReveal<HTMLElement>(0.3);
  const [selectedWorkCtaRef, selectedWorkCtaVisible] = useReveal<HTMLElement>(0.3);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [homeProjects, setHomeProjects] = useState<HomeProject[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!selectedWorkProofVisible) return;

    const target = 50;
    const duration = 900;
    const start = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDeliveredCount(Math.round(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [selectedWorkProofVisible]);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const projects = await listPublishedProjectsFn({ data: { limit: 8 } });
        if (!isMounted) return;
        setHomeProjects(projects);
      } catch {
        if (!isMounted) return;
        setHomeProjects([]);
      } finally {
        if (isMounted) {
          setProjectsLoaded(true);
        }
      }
    };

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProject = homeProjects.find((project) => project.featured) ?? homeProjects[0] ?? null;
  const remainingProjects = featuredProject
    ? homeProjects.filter((project) => project.id !== featuredProject.id)
    : homeProjects;
  const secondaryProjects = remainingProjects.slice(0, 2);
  const customProject = remainingProjects[2] ?? null;

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
            <HyruxLogo size="md" />
            <nav
              className="hidden items-center nav-links-list md:flex"
              aria-label="Main navigation"
            >
              {navItems.map(([label, href]) => (
                <a key={href} href={href} className="nav-link">
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <a href="/contact" className="nav-cta hidden md:inline-flex">
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
                {navItems.map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className="block py-2.5 text-base font-medium text-foreground hover:opacity-70 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                ))}
                <a href="/contact" className="nav-cta mt-3 w-full justify-center">
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
              We create digital experiences that make your business stand out from the first click.
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

            {/* Dashboard */}
            <div className="w-full flex justify-center animate-dashboard" style={{ marginTop: 60 }}>
              <HyruxDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAND ───────────────────────────────────────────── */}
      <section style={{ padding: "52px 0 60px", background: "#F8F4EF", textAlign: "center" }}>
        <p
          style={{
            fontSize: "0.78rem",
            color: "rgba(13,13,13,0.4)",
            letterSpacing: "0.04em",
            marginBottom: 32,
          }}
        >
          Built for the people creating tomorrow's digital economy
        </p>
        <div className="marquee" aria-label="Who Hyrux is for">
          <div className="marquee-track">
            {[
              "INDIE MAKERS",
              "CREATORS",
              "AGENCIES",
              "SAAS FOUNDERS",
              "GLOBAL TEAMS",
              "ENTREPRENEURS",
              "INDIE MAKERS",
              "CREATORS",
              "AGENCIES",
              "SAAS FOUNDERS",
              "GLOBAL TEAMS",
              "ENTREPRENEURS",
            ].map((item, i) => (
              <span key={i}>
                <Sparkles size={11} /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY HYRUX ────────────────────────────────────────────── */}
      <section id="vision" className="section-space" style={{ background: "#F8F4EF" }}>
        <div className="site-container">
          <div
            className="why-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "0.8fr 1.2fr",
              gap: 72,
              alignItems: "start",
            }}
          >
            <div>
              <p className="eyebrow">ONE IDEA. EVERY TOOL.</p>
            </div>
            <div>
              <h2 className="section-title">
                From first spark to global scale — all in one place.
              </h2>
              <p className="section-copy">
                Creators lose momentum stitching together page builders, payments, licensing,
                analytics, and communities. Hyrux replaces the patchwork with one beautifully
                connected system — so you ship, not scramble.
              </p>
              <div
                className="why-stats-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                  marginTop: 40,
                }}
              >
                {[
                  { value: "48h", label: "Idea to launch" },
                  { value: "50+", label: "Payout currencies" },
                  { value: "12", label: "Report languages" },
                ].map(({ value, label }) => (
                  <div key={label} className="stat">
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SELECTED WORK ──────────────────────────────────────── */}
      <section
        id="products"
        ref={selectedWorkRef}
        className={`section-space selected-work-section studio-reveal ${selectedWorkVisible ? "is-visible" : ""}`}
        style={{ background: "#EFF5F9" }}
      >
        <div className="site-container">
          <div className="selected-work-intro">
            <div>
              <p className="eyebrow">SELECTED WORK</p>
              <h2 className="section-title selected-work-title" style={{ marginTop: 14 }}>
                We don&apos;t just talk about ideas. We build them.
              </h2>
            </div>
            <div>
              <p className="section-copy selected-work-copy">
                From business websites and full-stack platforms to custom software, data solutions,
                and AI-powered products, we&apos;ve helped turn ideas into products built for the
                real world.
              </p>
              <p className="selected-work-proof-mini">50+ PRODUCTS DELIVERED</p>
            </div>
          </div>

          {!projectsLoaded ? (
            <div className="selected-work-proof-block" style={{ marginTop: 18 }}>
              <p className="selected-work-proof-copy">Loading published projects...</p>
            </div>
          ) : null}

          {projectsLoaded && !featuredProject ? (
            <div className="selected-work-proof-block" style={{ marginTop: 18 }}>
              <p className="selected-work-proof-title">NO PUBLISHED PROJECTS YET</p>
              <p className="selected-work-proof-copy">
                Draft projects are private. Publish from the admin panel to display them here
                automatically.
              </p>
            </div>
          ) : null}

          {featuredProject ? (
            <article className={`selected-work-feature ${selectedWorkVisible ? "is-visible" : ""}`}>
              <div className="selected-work-feature-text">
                <p className="selected-work-category">01 / {featuredProject.category.toUpperCase()}</p>
                <h3 className="selected-work-project-title">{featuredProject.title}</h3>
                <p className="selected-work-project-description">{featuredProject.shortDescription}</p>
                <ul className="selected-work-tech-list">
                  {featuredProject.technologies.map((tech) => (
                    <li key={tech} className="selected-work-tech-chip">
                      {tech}
                    </li>
                  ))}
                </ul>
                <a href={`/projects/${featuredProject.slug}`} className="selected-work-link">
                  View Project <ArrowRight size={14} />
                </a>
              </div>
              <div className="selected-work-feature-visual">
                <span className="selected-work-badge">
                  {featuredProject.featured ? "PRIMARY FEATURED" : "SELECTED PROJECT"}
                </span>
                <div className="selected-work-browser-shell selected-work-browser-featured">
                  <div className="selected-work-browser-top">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="selected-work-browser-body">
                    {featuredProject.mainImage ? (
                      <img
                        src={featuredProject.mainImage}
                        alt={featuredProject.title}
                        className="selected-work-project-shot"
                        loading="lazy"
                      />
                    ) : (
                      <div className="selected-work-project-shot placeholder">PROJECT SCREENSHOT</div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ) : null}

          {secondaryProjects.length > 0 ? (
            <div className="selected-work-grid-two-col">
              {secondaryProjects.map((project, index) => {
                const isAi = project.category.toLowerCase().includes("ai");

                return (
                  <article
                    key={project.id}
                    className={`selected-work-card selected-work-reveal-item ${selectedWorkVisible ? "is-visible" : ""}`}
                    style={{ transitionDelay: `${120 + index * 80}ms` }}
                  >
                    <div className={`selected-work-browser-shell ${isAi ? "is-ai" : "is-web"}`}>
                      <div className="selected-work-browser-top">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="selected-work-browser-body">
                        {project.mainImage ? (
                          <img
                            src={project.mainImage}
                            alt={project.title}
                            className="selected-work-project-shot"
                            loading="lazy"
                          />
                        ) : (
                          <div className="selected-work-project-shot placeholder">
                            PROJECT SCREENSHOT
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="selected-work-category">
                      {String(index + 2).padStart(2, "0")} / {project.category.toUpperCase()}
                    </p>
                    <h3 className="selected-work-project-title">{project.title}</h3>
                    <p className="selected-work-project-description">{project.shortDescription}</p>
                    <ul className="selected-work-tech-list">
                      {project.technologies.map((tech) => (
                        <li key={tech} className="selected-work-tech-chip">
                          {tech}
                        </li>
                      ))}
                    </ul>
                    <a href={`/projects/${project.slug}`} className="selected-work-link">
                      View Project <ArrowRight size={14} />
                    </a>
                  </article>
                );
              })}
            </div>
          ) : null}

          {customProject ? (
            <article
              className={`selected-work-wide selected-work-reveal-item ${selectedWorkVisible ? "is-visible" : ""}`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="selected-work-browser-shell is-platform">
                <div className="selected-work-browser-top">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="selected-work-browser-body">
                  {customProject.mainImage ? (
                    <img
                      src={customProject.mainImage}
                      alt={customProject.title}
                      className="selected-work-project-shot"
                      loading="lazy"
                    />
                  ) : (
                    <div className="selected-work-project-shot placeholder">PROJECT SCREENSHOT</div>
                  )}
                </div>
              </div>
              <div className="selected-work-wide-content">
                <p className="selected-work-category">04 / {customProject.category.toUpperCase()}</p>
                <h3 className="selected-work-project-title">{customProject.title}</h3>
                <p className="selected-work-project-description">{customProject.shortDescription}</p>
                <ul className="selected-work-tech-list">
                  {customProject.technologies.map((tech) => (
                    <li key={tech} className="selected-work-tech-chip">
                      {tech}
                    </li>
                  ))}
                </ul>
                <a href={`/projects/${customProject.slug}`} className="selected-work-link">
                  View Project <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ) : null}

          <section
            ref={selectedWorkProofRef}
            className={`selected-work-proof-block studio-reveal ${selectedWorkProofVisible ? "is-visible" : ""}`}
          >
            <p
              className={`selected-work-proof-value ${selectedWorkProofVisible ? "is-visible" : ""}`}
            >
              {deliveredCount}+
            </p>
            <p className="selected-work-proof-title">PRODUCTS DELIVERED</p>
            <p className="selected-work-proof-copy">
              Different businesses. Different challenges. One team focused on turning ideas into
              technology that works.
            </p>
            <ul className="selected-work-proof-list">
              {proofLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </section>

          <section
            ref={selectedWorkCtaRef}
            className={`selected-work-final-cta studio-reveal ${selectedWorkCtaVisible ? "is-visible" : ""}`}
          >
            <h3>Have an idea worth building?</h3>
            <p>Let&apos;s turn it into something real.</p>
            <a href="/contact" className="selected-work-link selected-work-cta-link">
              Start a Project <ArrowRight size={15} />
            </a>
          </section>
        </div>
      </section>

      {/* ── VISION / VALUES ──────────────────────────────────────── */}
      <section className="section-space" style={{ background: "#F8F4EF" }}>
        <div className="site-container">
          <p className="eyebrow" style={{ marginBottom: 14 }}>
            OUR NORTH STAR
          </p>
          <blockquote
            style={{
              maxWidth: 900,
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              color: "#0d0d0d",
              marginBottom: 72,
            }}
          >
            Anyone with an idea should be able to turn it into a sustainable digital business.
          </blockquote>

          {/* Values grid */}
          <div
            className="values-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {[
              {
                icon: Sparkles,
                title: "Radical simplicity",
                copy: "Powerful enough for enterprises. Clear enough for a first-time creator. No bloat — just the tools you need.",
              },
              {
                icon: Globe2,
                title: "Global by default",
                copy: "Beautiful in every language, currency, and market from day one. Built for the world, not just one country.",
              },
              {
                icon: LockKeyhole,
                title: "Privacy first",
                copy: "Your work, customers, and business intelligence remain yours — always. No dark patterns, ever.",
              },
            ].map(({ icon: Icon, title, copy }, i) => (
              <div
                key={title}
                className="values-cell"
                style={{
                  padding: "36px 32px",
                  background: "#fff",
                  borderRight: i < 2 ? "1px solid rgba(0,0,0,0.08)" : "none",
                  minHeight: 240,
                }}
              >
                <Icon size={22} color="rgba(13,13,13,0.5)" />
                <h3
                  style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: 44, marginBottom: 10 }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "rgba(13,13,13,0.55)" }}>
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBAL ───────────────────────────────────────────────── */}
      <section style={{ background: "#0d0d0d", paddingBlock: 112 }}>
        <div
          className="site-container global-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.66rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.38)",
                marginBottom: 20,
              }}
            >
              GLOBAL FROM THE BEGINNING
            </p>
            <h2
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.04,
                color: "#fff",
                marginBottom: 20,
              }}
            >
              One horizon.
              <br />
              Every language.
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.68,
                color: "rgba(255,255,255,0.6)",
                maxWidth: 420,
              }}
            >
              Hyrux begins with the Sanskrit letter <strong style={{ color: "#fff" }}>ह</strong> —
              the horizon, the beginning — and carries that spirit across every market worldwide.
            </p>
            <div style={{ marginTop: 28, display: "inline-block" }}>
              <div
                style={{
                  padding: "8px 10px 10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 14,
                  display: "inline-flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.62rem",
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: "0.08em",
                    paddingLeft: 4,
                  }}
                >
                  OFFICIAL BRANDMARK
                </span>
                <img
                  src="/hyrux-logo-card.png"
                  alt="Hyrux.in Official Brandmark"
                  style={{ height: 50, width: "auto", borderRadius: 8 }}
                />
              </div>
            </div>
          </div>
          <div
            className="language-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {[
              ["ह्यरुक्स", "Devanagari"],
              ["ハイラックス", "Japanese"],
              ["海睿克斯", "Chinese"],
              ["هيروكس", "Arabic"],
              ["Хайрукс", "Russian"],
              ["하이럭스", "Korean"],
            ].map(([name, lang]) => (
              <div
                key={lang}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "22px 24px",
                  background: "#111",
                  minHeight: 110,
                  border: "none",
                }}
              >
                <span style={{ fontSize: "1.6rem", color: "#fff", fontWeight: 400 }}>{name}</span>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.62rem",
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {lang}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section id="pricing" className="section-space" style={{ background: "#EFF5F9" }}>
        <div className="site-container">
          <p className="eyebrow" style={{ textAlign: "center" }}>
            PRICING
          </p>
          <h2 className="section-title" style={{ textAlign: "center", margin: "10px auto 12px" }}>
            Start small. Build bigger.
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              color: "rgba(13,13,13,0.55)",
              marginBottom: 56,
              maxWidth: 640,
              marginInline: "auto",
            }}
          >
            Choose a ready-to-start package or tell us what you need. We&apos;ll help you find the
            right way to build it.
          </p>

          <PricingSection />
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
            Build the digital business
            <br />
            only you can imagine.
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
            Hyrux is coming to creators, entrepreneurs, and teams building what comes next. Join the
            early access list.
          </p>
          <a
            href="mailto:hello@hyrux.com"
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
            Join the early access list <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ background: "#F8F4EF" }}>
        <div className="site-container">
          <div
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr 1fr",
              gap: 60,
              padding: "56px 0 44px",
              borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div>
              <HyruxLogo />
              <p
                style={{
                  marginTop: 14,
                  fontSize: "0.875rem",
                  lineHeight: 1.65,
                  color: "rgba(13,13,13,0.5)",
                  maxWidth: 300,
                }}
              >
                The all-in-one platform to design, launch, sell, and scale digital products. Born
                from the Sanskrit ह — the horizon, the beginning.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <a
                  href="https://hyrux.com"
                  aria-label="Website"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#0d0d0d",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  ह
                </a>
                <a
                  href="mailto:hello@hyrux.com"
                  aria-label="Email"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#0d0d0d",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  @
                </a>
              </div>
            </div>
            <div>
              <h5
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "rgba(13,13,13,0.36)",
                  marginBottom: 16,
                }}
              >
                WORK
              </h5>
              {[
                ["Selected Work", "/projects"],
                ["Web Development", "/projects"],
                ["Full-Stack Applications", "/projects"],
                ["Custom Software", "/projects"],
                ["AI / ML Solutions", "/projects"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "rgba(13,13,13,0.6)",
                    marginBottom: 10,
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
            <div>
              <h5
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "rgba(13,13,13,0.36)",
                  marginBottom: 16,
                }}
              >
                COMPANY
              </h5>
              {[
                ["About", "/about"],
                ["Pricing", "/pricing"],
                ["Blog", "/blog"],
                ["Careers", "/careers"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href as string}
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "rgba(13,13,13,0.6)",
                    marginBottom: 10,
                  }}
                >
                  {label as string}
                </a>
              ))}
            </div>
          </div>
          <div
            className="footer-bottom-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 0",
              borderTop: "1px solid rgba(0,0,0,0.07)",
              fontSize: "0.78rem",
              color: "rgba(13,13,13,0.36)",
            }}
          >
            <span>
              © 2026 Hyrux ·{" "}
              <a href="https://hyrux.com" style={{ color: "inherit" }}>
                hyrux.com
              </a>
            </span>
            <span>Horizon of Digital Creation · ह्यरुक्स</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
