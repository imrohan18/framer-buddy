import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Box,
  Brain,
  Check,
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
import { useState } from "react";

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
    sm: 24,
    md: 30,
    lg: 42,
  };
  const markSizes = {
    sm: 28,
    md: 34,
    lg: 44,
  };
  const markFonts = {
    sm: "1rem",
    md: "1.25rem",
    lg: "1.7rem",
  };

  if (badge) {
    return (
      <a href="#top" className="inline-flex items-center" aria-label="Hyrux home">
        <img
          src="/hyrux-logo-card.png"
          alt="हYRUX.in"
          style={{ height: heights[size] + 16, width: "auto", borderRadius: 8 }}
        />
      </a>
    );
  }

  return (
    <a href="#top" className="flex items-center gap-2.5 group" aria-label="Hyrux home" style={{ textDecoration: "none" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "rgba(0,0,0,0.04)", borderRadius: 6, maxWidth: 240, fontSize: "0.72rem", color: "rgba(13,13,13,0.4)" }}>
            <span>🔍</span> Search products, orders…
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#C4D8E8,#B0CBE0)", border: "2px solid #fff" }} />
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "grid", gridTemplateColumns: "196px 1fr", minHeight: 400 }}>
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(13,13,13,0.32)", padding: "6px 12px 4px" }}>WORKSPACE</p>
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
          <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(13,13,13,0.32)", padding: "14px 12px 4px" }}>COMING SOON</p>
          <div className="dash-nav">
            <Users size={14} />
            <span>Connect</span>
          </div>
          <div style={{ marginTop: "auto", padding: "14px 12px 4px" }}>
            <div style={{ background: "linear-gradient(135deg,#C4D8E8 0%,#D8EAF4 100%)", borderRadius: 8, padding: "12px 14px" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 650 }}>Upgrade to Pro</p>
              <p style={{ fontSize: "0.65rem", color: "rgba(13,13,13,0.55)", marginTop: 4 }}>Unlock global payouts &amp; AI features.</p>
              <div style={{ marginTop: 10, padding: "5px 12px", borderRadius: 999, background: "#0d0d0d", color: "#fff", fontSize: "0.68rem", fontWeight: 600, display: "inline-block" }}>Upgrade</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="dashboard-main">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <p style={{ fontSize: "0.72rem", color: "rgba(13,13,13,0.4)" }}>Good morning, Creator</p>
              <p style={{ fontSize: "1rem", fontWeight: 650, marginTop: 2 }}>Your digital business</p>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 999, background: "#0d0d0d", color: "#fff", fontSize: "0.78rem", fontWeight: 600 }}>
              <Sparkles size={13} /> Create new
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Revenue", icon: "💰", value: "$24,860", change: "+18.4%", pos: true },
              { label: "Customers", icon: "👥", value: "1,248", change: "+9.2%", pos: true },
              { label: "Conversion", icon: "📈", value: "7.8%", change: "+2.1%", pos: true },
            ].map((s) => (
              <div className="metric" key={s.label}>
                <p><span>{s.icon}</span> {s.label}</p>
                <strong>{s.value}</strong>
                <span className="pos">{s.change}</span>
              </div>
            ))}
          </div>

          {/* Charts + table */}
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 10 }}>
            <div className="dash-panel">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
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
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", marginBottom: 4 }}>
                      <span>{name}</span><span style={{ fontWeight: 650 }}>{pct}</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(0,0,0,0.06)", borderRadius: 999 }}>
                      <div style={{ height: "100%", width: pct, background: color, borderRadius: 999 }} />
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

/* ============================================================
   PRODUCT CARD — for the "The Hyrux System" section
   ============================================================ */
const products = [
  {
    number: "01",
    name: "Studio",
    label: "CREATE",
    title: "Turn an idea into a product, beautifully.",
    copy: "Build landing pages, courses, templates, asset packs, and mini SaaS tools without wrestling with code. Built-in AI generates copy, layouts, and product ideas.",
    tags: ["AI co-creation", "No-code canvas", "One-click export"],
    icon: WandSparkles,
    bg: "#EBF3F8",
  },
  {
    number: "02",
    name: "Vault",
    label: "DELIVER",
    title: "Secure every download. Protect every sale.",
    copy: "Deliver products with smart licensing, time-limited access, team seats, and subscription gating built in. Instant payouts in 50+ currencies.",
    tags: ["Smart DRM", "Global payouts", "50+ currencies"],
    icon: LockKeyhole,
    bg: "#F5F0EB",
  },
  {
    number: "03",
    name: "Hub",
    label: "DISCOVER",
    title: "A marketplace made for digital makers.",
    copy: "List high-quality tools, courses, templates, and assets where curious buyers are already looking. Built-in affiliate system with automated commissions.",
    tags: ["Built-in affiliates", "Curated discovery", "Creator storefronts"],
    icon: Globe2,
    bg: "#EBF5F0",
  },
  {
    number: "04",
    name: "Insights",
    label: "GROW",
    title: "Know what's working before everyone else.",
    copy: "AI-powered analytics with real-time sales tracking, customer behavior prediction, churn analysis, and pricing optimization. Multilingual in 12 languages.",
    tags: ["Live analytics", "Churn signals", "12 languages"],
    icon: BarChart3,
    bg: "#F5F2EB",
  },
];

const navItems = [
  ["Products", "#products"],
  ["Vision", "#vision"],
  ["Pricing", "#pricing"],
  ["Blog", "#blog"],
  ["Join Us", "#connect"],
];

/* ============================================================
   MAIN PAGE
   ============================================================ */
function HyruxHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pricingAnnual, setPricingAnnual] = useState(true);

  return (
    <div id="top" style={{ minHeight: "100vh", background: "#C4D8E8" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="hero-band">
        {/* Floating clouds */}
        <div className="hero-cloud-left"><CloudSVG width={320} /></div>
        <div className="hero-cloud-right"><CloudSVG width={290} flip /></div>

        {/* Navbar */}
        <div className="site-nav">
          <div className="site-container">
            <div className="nav-pill">
              <HyruxLogo />
              <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
                {navItems.map(([label, href]) => (
                  <a key={href} href={href} className="nav-link">{label}</a>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                <a href="#connect" className="nav-cta hidden md:inline-flex">
                  Join the horizon
                </a>
                <button
                  className="md:hidden p-2 rounded-full hover:bg-black/5 transition"
                  aria-label="Toggle menu"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
            {menuOpen && (
              <nav className="mt-2 rounded-2xl border border-white/60 bg-white/85 backdrop-blur-xl p-5 md:hidden">
                {navItems.map(([label, href]) => (
                  <a key={href} href={href} className="block py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground" onClick={() => setMenuOpen(false)}>
                    {label}
                  </a>
                ))}
                <a href="#connect" className="nav-cta mt-3 w-full justify-center">Join the horizon</a>
              </nav>
            )}
          </div>
        </div>

        {/* Hero content */}
        <div className="site-container relative z-10">
          <div className="flex flex-col items-center text-center pt-16 pb-20">
            {/* Sanskrit mark */}
            <div className="animate-rise" style={{ marginBottom: 20 }}>
              <div style={{ display: "inline-grid", placeItems: "center", width: 68, height: 68, borderRadius: 16, background: "#0d0d0d", boxShadow: "0 10px 36px rgba(0,0,0,0.22)" }}>
                <CalligraphicHa size={36} color="#fff" />
              </div>
            </div>
            <p className="eyebrow animate-rise" style={{ marginBottom: 0 }}>HORIZON OF DIGITAL CREATION</p>
            <h1 className="hero-title animate-rise-delay">
              Build what's next.<br />
              <span style={{ color: "rgba(13,13,13,0.45)" }}>Own what you create.</span>
            </h1>
            <p className="hero-copy animate-rise-delay-2">
              The all-in-one operating system to design, launch, sell, and scale
              digital products — without the friction. Go from idea to live product in under 48 hours.
            </p>
            <div className="flex items-center gap-3 mt-9 flex-wrap justify-center animate-rise-delay-2">
              <a
                href="#connect"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 999, background: "#0d0d0d", color: "#fff", fontSize: "0.95rem", fontWeight: 650 }}
              >
                Start building <ArrowRight size={16} />
              </a>
              <a
                href="#products"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 999, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.1)", color: "#0d0d0d", fontSize: "0.95rem", fontWeight: 500 }}
              >
                <Play size={14} className="fill-current" /> Explore products
              </a>
            </div>

            {/* Dashboard */}
            <div className="w-full flex justify-center" style={{ marginTop: 60 }}>
              <HyruxDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAND ───────────────────────────────────────────── */}
      <section style={{ padding: "52px 0 60px", background: "#F8F4EF", textAlign: "center" }}>
        <p style={{ fontSize: "0.78rem", color: "rgba(13,13,13,0.4)", letterSpacing: "0.04em", marginBottom: 32 }}>
          Built for the people creating tomorrow's digital economy
        </p>
        <div className="marquee" aria-label="Who Hyrux is for">
          <div className="marquee-track">
            {["INDIE MAKERS", "CREATORS", "AGENCIES", "SAAS FOUNDERS", "GLOBAL TEAMS", "ENTREPRENEURS", "INDIE MAKERS", "CREATORS", "AGENCIES", "SAAS FOUNDERS", "GLOBAL TEAMS", "ENTREPRENEURS"].map((item, i) => (
              <span key={i}><Sparkles size={11} /> {item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY HYRUX ────────────────────────────────────────────── */}
      <section id="vision" className="section-space" style={{ background: "#F8F4EF" }}>
        <div className="site-container">
          <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 72, alignItems: "start" }}>
            <div>
              <p className="eyebrow">ONE IDEA. EVERY TOOL.</p>
            </div>
            <div>
              <h2 className="section-title">
                From first spark to global scale — all in one place.
              </h2>
              <p className="section-copy">
                Creators lose momentum stitching together page builders, payments, licensing, analytics, and communities. Hyrux replaces the patchwork with one beautifully connected system — so you ship, not scramble.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 40 }}>
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

      {/* ── THE HYRUX SYSTEM ─────────────────────────────────────── */}
      <section id="products" className="section-space" style={{ background: "#EFF5F9" }}>
        <div className="site-container">
          <div className="section-heading-row" style={{ marginBottom: 52 }}>
            <div>
              <p className="eyebrow">THE HYRUX SYSTEM</p>
              <h2 className="section-title" style={{ marginTop: 14 }}>
                Everything your digital business needs.
              </h2>
            </div>
            <p className="section-copy">
              Five connected products. One clear path from creation to global scale.
            </p>
          </div>

          {/* Product grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <article
                  key={product.name}
                  style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, overflow: "hidden", transition: "box-shadow 250ms ease, transform 250ms ease" }}
                  className="group"
                >
                  {/* Visual area */}
                  <div style={{ height: 200, background: product.bg, position: "relative", padding: 28, overflow: "hidden" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(13,13,13,0.4)" }}>
                      {product.number}
                    </span>
                    <div style={{ position: "absolute", top: 24, right: 24, display: "grid", width: 40, height: 40, placeItems: "center", borderRadius: 999, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)" }}>
                      <Icon size={18} />
                    </div>
                    {/* Mockup window */}
                    <div style={{ position: "absolute", left: 56, right: -20, bottom: -12, height: 120, padding: 14, border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px 0 0 0", background: "rgba(255,255,255,0.92)", boxShadow: "0 16px 40px rgba(0,0,0,0.1)", transition: "transform 0.4s ease" }}
                      className="visual-window"
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 650 }}>Hyrux {product.name}</span>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 6 }}>
                        {[1,2,3].map(i => <div key={i} style={{ height: 22, borderRadius: 4, background: "rgba(0,0,0,0.06)" }} />)}
                      </div>
                      <div style={{ height: 36, borderRadius: 4, background: "rgba(0,0,0,0.04)" }} />
                    </div>
                  </div>
                  {/* Content */}
                  <div style={{ padding: "24px 28px 28px" }}>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(13,13,13,0.38)", marginBottom: 10 }}>
                      {product.label}
                    </p>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 10 }}>
                      Hyrux {product.name}
                    </h3>
                    <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(13,13,13,0.6)", marginBottom: 12 }}>{product.title}</p>
                    <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "rgba(13,13,13,0.5)", marginBottom: 18 }}>{product.copy}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {product.tags.map(tag => (
                        <li key={tag} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.1)", background: "#fff", fontSize: "0.78rem", fontWeight: 500 }}>
                          <Check size={11} /> {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Hyrux Connect — dark community card */}
          <div style={{ position: "relative", minHeight: 340, overflow: "hidden", borderRadius: 16, padding: "60px 64px", background: "#0d0d0d" }}>
            <div style={{ position: "relative", zIndex: 10, maxWidth: 520 }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>
                UPCOMING · HYRUX CONNECT
              </p>
              <h3 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", color: "#fff", lineHeight: 1.1, marginBottom: 18 }}>
                Turn buyers into belonging.
              </h3>
              <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.6)", marginBottom: 32, maxWidth: 400 }}>
                Create a thriving membership community around your products and turn one-time customers into loyal, recurring subscribers.
              </p>
              <a
                href="#connect"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 999, background: "#fff", color: "#0d0d0d", fontSize: "0.9rem", fontWeight: 650 }}
              >
                Get early access <ArrowRight size={15} />
              </a>
            </div>
            {/* Orbit decoration */}
            <div style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", width: 260, height: 260, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)", display: "grid", placeItems: "center" }}>
              <Users size={56} color="rgba(255,255,255,0.6)" />
              <span style={{ position: "absolute", width: 28, height: 28, borderRadius: "50%", background: "#7EC8E3", border: "4px solid #0d0d0d", left: -13, top: "46%" }} />
              <span style={{ position: "absolute", width: 28, height: 28, borderRadius: "50%", background: "#D95338", border: "4px solid #0d0d0d", right: 14, top: 14 }} />
              <span style={{ position: "absolute", width: 28, height: 28, borderRadius: "50%", background: "#F0B429", border: "4px solid #0d0d0d", right: 26, bottom: 6 }} />
              <div style={{ position: "absolute", inset: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", inset: 70, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION / VALUES ──────────────────────────────────────── */}
      <section className="section-space" style={{ background: "#F8F4EF" }}>
        <div className="site-container">
          <p className="eyebrow" style={{ marginBottom: 14 }}>OUR NORTH STAR</p>
          <blockquote style={{ maxWidth: 900, fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 700, lineHeight: 1.04, letterSpacing: "-0.025em", color: "#0d0d0d", marginBottom: 72 }}>
            Anyone with an idea should be able to turn it into a sustainable digital business.
          </blockquote>

          {/* Values grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
            {[
              { icon: Sparkles, title: "Radical simplicity", copy: "Powerful enough for enterprises. Clear enough for a first-time creator. No bloat — just the tools you need." },
              { icon: Globe2, title: "Global by default", copy: "Beautiful in every language, currency, and market from day one. Built for the world, not just one country." },
              { icon: LockKeyhole, title: "Privacy first", copy: "Your work, customers, and business intelligence remain yours — always. No dark patterns, ever." },
            ].map(({ icon: Icon, title, copy }, i) => (
              <div
                key={title}
                style={{ padding: "36px 32px", background: "#fff", borderRight: i < 2 ? "1px solid rgba(0,0,0,0.08)" : "none", minHeight: 240 }}
              >
                <Icon size={22} color="rgba(13,13,13,0.5)" />
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: 44, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "rgba(13,13,13,0.55)" }}>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBAL ───────────────────────────────────────────────── */}
      <section style={{ background: "#0d0d0d", paddingBlock: 112 }}>
        <div className="site-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.38)", marginBottom: 20 }}>
              GLOBAL FROM THE BEGINNING
            </p>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.04, color: "#fff", marginBottom: 20 }}>
              One horizon.<br />Every language.
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.72, color: "rgba(255,255,255,0.55)", maxWidth: 380 }}>
              Hyrux begins with the Sanskrit letter <strong style={{ color: "#fff" }}>ह</strong> — the horizon, the beginning — and carries that spirit across every market worldwide.
            </p>
            <div style={{ marginTop: 28, display: "inline-block" }}>
              <div style={{ padding: "8px 10px 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, display: "inline-flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", paddingLeft: 4 }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" }}>
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
                style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "22px 24px", background: "#111", minHeight: 110, border: "none" }}
              >
                <span style={{ fontSize: "1.6rem", color: "#fff", fontWeight: 400 }}>{name}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>{lang}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section id="pricing" className="section-space" style={{ background: "#EFF5F9" }}>
        <div className="site-container">
          <p className="eyebrow" style={{ textAlign: "center" }}>PRICING</p>
          <h2 className="section-title" style={{ textAlign: "center", margin: "10px auto 8px" }}>
            Built for serious builders
          </h2>
          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "rgba(13,13,13,0.45)", marginBottom: 36 }}>
            Start free. Scale when you're ready. No surprise fees.
          </p>

          {/* Toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 44 }}>
            <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 999, padding: 4 }}>
              {["Annually", "Monthly"].map((label) => {
                const active = label === "Annually" ? pricingAnnual : !pricingAnnual;
                return (
                  <button
                    key={label}
                    onClick={() => setPricingAnnual(label === "Annually")}
                    style={{ padding: "8px 22px", borderRadius: 999, fontSize: "0.875rem", fontWeight: 550, background: active ? "#fff" : "transparent", color: active ? "#0d0d0d" : "rgba(13,13,13,0.5)", boxShadow: active ? "0 2px 8px rgba(0,0,0,0.08)" : "none", border: "none", cursor: "pointer", transition: "all 200ms" }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, alignItems: "start" }}>
            {/* Free */}
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 18, padding: "34px 30px" }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(13,13,13,0.5)", marginBottom: 8 }}>Hyrux Free</p>
              <div style={{ fontSize: "3.2rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8 }}>$0</div>
              <p style={{ fontSize: "0.875rem", color: "rgba(13,13,13,0.5)", marginBottom: 28 }}>Forever free to get started.</p>
              <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0 }}>
                {["1 digital product", "Hyrux Hub listing", "Basic analytics", "Community access", "Email support"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "rgba(13,13,13,0.7)", padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#22c55e", color: "#fff", fontSize: "0.6rem", display: "grid", placeItems: "center", flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button style={{ display: "block", width: "100%", textAlign: "center", padding: 14, borderRadius: 12, fontSize: "0.9rem", fontWeight: 600, background: "transparent", border: "1px solid rgba(0,0,0,0.15)", color: "#0d0d0d", cursor: "pointer" }}>
                Get started free
              </button>
            </div>

            {/* Pro (featured) */}
            <div style={{ background: "linear-gradient(160deg, #EBF3F8 0%, #F5F9FC 100%)", border: "1.5px solid #B8D0E2", borderRadius: 18, padding: "34px 30px", boxShadow: "0 4px 28px rgba(0,0,0,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(13,13,13,0.5)" }}>Hyrux Pro</p>
                <span style={{ padding: "3px 10px", borderRadius: 999, background: "#0d0d0d", color: "#fff", fontSize: "0.7rem", fontWeight: 700 }}>
                  {pricingAnnual ? "Save 25%" : "Most popular"}
                </span>
              </div>
              <div style={{ fontSize: "3.2rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4 }}>
                {pricingAnnual ? "$29" : "$39"}
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(13,13,13,0.45)", marginBottom: 6 }}>/mo · billed {pricingAnnual ? "annually" : "monthly"}</p>
              <p style={{ fontSize: "0.875rem", color: "rgba(13,13,13,0.55)", marginBottom: 28 }}>For serious builders who want to scale.</p>
              <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0 }}>
                {["Unlimited products", "Studio AI builder", "Smart DRM & Vault", "Insights dashboard", "Global payouts (50+ currencies)", "Affiliate system"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "rgba(13,13,13,0.75)", padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#22c55e", color: "#fff", fontSize: "0.6rem", display: "grid", placeItems: "center", flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button style={{ display: "block", width: "100%", textAlign: "center", padding: 14, borderRadius: 12, fontSize: "0.9rem", fontWeight: 650, background: "#0d0d0d", color: "#fff", border: "none", cursor: "pointer" }}>
                Start building
              </button>
            </div>

            {/* Enterprise */}
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 18, padding: "34px 30px" }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(13,13,13,0.5)", marginBottom: 8 }}>Hyrux Enterprise</p>
              <div style={{ fontSize: "3.2rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8 }}>Custom</div>
              <p style={{ fontSize: "0.875rem", color: "rgba(13,13,13,0.5)", marginBottom: 28 }}>For agencies and scaling teams.</p>
              <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0 }}>
                {["Everything in Pro", "White-label branding", "Team seats & roles", "Custom integrations", "Dedicated support", "SLA guarantee"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "rgba(13,13,13,0.7)", padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#22c55e", color: "#fff", fontSize: "0.6rem", display: "grid", placeItems: "center", flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button style={{ display: "block", width: "100%", textAlign: "center", padding: 14, borderRadius: 12, fontSize: "0.9rem", fontWeight: 600, background: "transparent", border: "1px solid rgba(0,0,0,0.15)", color: "#0d0d0d", cursor: "pointer" }}>
                Contact us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────── */}
      <section id="connect" className="cta-band" style={{ background: "#C4D8E8", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -50, top: 10, opacity: 0.65, pointerEvents: "none" }}>
          <CloudSVG width={320} />
        </div>
        <div style={{ position: "absolute", right: -50, top: 50, opacity: 0.65, pointerEvents: "none" }}>
          <CloudSVG width={300} flip />
        </div>
        <div className="site-container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div style={{ display: "inline-grid", placeItems: "center", width: 60, height: 60, borderRadius: 13, background: "#0d0d0d", color: "#fff", fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif", fontSize: "2rem", fontWeight: 600, marginBottom: 32, boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}>
            ह
          </div>
          <p className="eyebrow" style={{ marginBottom: 16 }}>THE HORIZON IS OPEN</p>
          <h2 style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.03, marginBottom: 22 }}>
            Build the digital business<br />only you can imagine.
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(13,13,13,0.6)", marginBottom: 36, maxWidth: 500, marginInline: "auto" }}>
            Hyrux is coming to creators, entrepreneurs, and teams building what comes next. Join the early access list.
          </p>
          <a
            href="mailto:hello@hyrux.com"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 999, background: "#0d0d0d", color: "#fff", fontSize: "1rem", fontWeight: 650 }}
          >
            Join the early access list <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ background: "#F8F4EF" }}>
        <div className="site-container">
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 60, padding: "56px 0 44px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
            <div>
              <HyruxLogo />
              <p style={{ marginTop: 14, fontSize: "0.875rem", lineHeight: 1.65, color: "rgba(13,13,13,0.5)", maxWidth: 300 }}>
                The all-in-one platform to design, launch, sell, and scale digital products. Born from the Sanskrit ह — the horizon, the beginning.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <a href="https://hyrux.com" aria-label="Website" style={{ width: 34, height: 34, borderRadius: "50%", background: "#0d0d0d", color: "#fff", display: "grid", placeItems: "center", fontSize: "0.7rem", fontWeight: 700, textDecoration: "none" }}>
                  ह
                </a>
                <a href="mailto:hello@hyrux.com" aria-label="Email" style={{ width: 34, height: 34, borderRadius: "50%", background: "#0d0d0d", color: "#fff", display: "grid", placeItems: "center", fontSize: "0.7rem", fontWeight: 700, textDecoration: "none" }}>
                  @
                </a>
              </div>
            </div>
            <div>
              <h5 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(13,13,13,0.36)", marginBottom: 16 }}>PRODUCTS</h5>
              {["Studio", "Vault", "Hub", "Insights", "Connect"].map(l => (
                <a key={l} href="#products" style={{ display: "block", fontSize: "0.875rem", color: "rgba(13,13,13,0.6)", marginBottom: 10 }}>
                  Hyrux {l}
                </a>
              ))}
            </div>
            <div>
              <h5 style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(13,13,13,0.36)", marginBottom: 16 }}>COMPANY</h5>
              {["About", "Pricing", "Blog", "Careers", "Contact"].map(l => (
                <a key={l} href="#connect" style={{ display: "block", fontSize: "0.875rem", color: "rgba(13,13,13,0.6)", marginBottom: 10 }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", borderTop: "1px solid rgba(0,0,0,0.07)", fontSize: "0.78rem", color: "rgba(13,13,13,0.36)" }}>
            <span>© 2026 Hyrux · <a href="https://hyrux.com" style={{ color: "inherit" }}>hyrux.com</a></span>
            <span>Horizon of Digital Creation · ह्यरुक्स</span>
          </div>
        </div>
      </footer>
    </div>
  );
}