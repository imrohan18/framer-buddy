import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Box,
  Check,
  ChevronRight,
  CircleDollarSign,
  Globe2,
  Layers3,
  LockKeyhole,
  Menu,
  MousePointer2,
  PackageCheck,
  Play,
  Sparkles,
  UsersRound,
  WandSparkles,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hyrux — Horizon of Digital Creation" },
      {
        name: "description",
        content:
          "Hyrux is the all-in-one platform to design, launch, sell, and scale digital products.",
      },
      { property: "og:title", content: "Hyrux — Horizon of Digital Creation" },
      {
        property: "og:description",
        content: "Build and grow digital products with Hyrux Studio, Vault, Hub, and Insights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HyruxHome,
});

const products = [
  {
    number: "01",
    name: "Studio",
    label: "CREATE",
    title: "Turn an idea into a product, beautifully.",
    copy: "Build landing pages, courses, templates, asset packs, and mini SaaS tools without wrestling with code.",
    tags: ["AI co-creation", "No-code canvas", "One-click export"],
    icon: WandSparkles,
    tone: "bg-product-blue",
  },
  {
    number: "02",
    name: "Vault",
    label: "DELIVER",
    title: "Secure every download. Protect every sale.",
    copy: "Deliver products with smart licensing, time-limited access, team seats, and subscription gating built in.",
    tags: ["Smart DRM", "Global payouts", "50+ currencies"],
    icon: LockKeyhole,
    tone: "bg-product-peach",
  },
  {
    number: "03",
    name: "Hub",
    label: "DISCOVER",
    title: "A marketplace made for digital makers.",
    copy: "List high-quality tools, courses, templates, and assets where curious buyers are already looking.",
    tags: ["Built-in affiliates", "Curated discovery", "Creator storefronts"],
    icon: Globe2,
    tone: "bg-product-green",
  },
  {
    number: "04",
    name: "Insights",
    label: "GROW",
    title: "Know what is working before everyone else.",
    copy: "See live sales, predict customer behavior, spot churn, and optimize pricing with an intelligent command center.",
    tags: ["Live analytics", "Churn signals", "12 languages"],
    icon: BarChart3,
    tone: "bg-product-gold",
  },
];

const navItems = [
  ["Products", "#products"],
  ["Why Hyrux", "#why"],
  ["Vision", "#vision"],
  ["Connect", "#connect"],
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="Hyrux home">
      <span className="grid size-9 place-items-center rounded-sm bg-ink font-display text-xl font-semibold text-canvas">
        ह
      </span>
      <span className="font-display text-[1.35rem] font-semibold">HYRUX</span>
    </a>
  );
}

function ProductDashboard() {
  return (
    <div className="dashboard-shell" aria-label="Preview of the Hyrux creator dashboard">
      <aside className="dashboard-sidebar">
        <Logo />
        <div className="mt-10 space-y-1.5">
          {[
            [Layers3, "Overview"],
            [MousePointer2, "Studio"],
            [LockKeyhole, "Vault"],
            [Box, "Products"],
            [BarChart3, "Insights"],
          ].map(([Icon, label], index) => {
            const DashboardIcon = Icon as typeof Layers3;
            return (
              <div key={label as string} className={`dash-nav ${index === 0 ? "dash-nav-active" : ""}`}>
                <DashboardIcon className="size-4" />
                <span>{label as string}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-auto rounded-md bg-muted p-3">
          <p className="text-xs font-semibold">Hyrux Connect</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Community is coming soon.</p>
        </div>
      </aside>
      <main className="dashboard-main">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Good morning, Aria</p>
            <h3 className="mt-1 text-lg font-semibold">Your digital business</h3>
          </div>
          <Button size="sm" className="rounded-full px-4">
            <Sparkles /> Create new
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            ["Revenue", "$24,860", "+18.4%"],
            ["Customers", "1,248", "+9.2%"],
            ["Conversion", "7.8%", "+2.1%"],
          ].map(([label, value, change]) => (
            <div className="metric" key={label}>
              <p>{label}</p>
              <strong>{value}</strong>
              <span>{change}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid min-h-52 grid-cols-[1.55fr_1fr] gap-3">
          <div className="dash-panel">
            <div className="flex items-center justify-between">
              <h4>Growth</h4>
              <span className="dash-chip">Last 6 months</span>
            </div>
            <div className="chart-bars">
              {[38, 55, 43, 74, 61, 88, 68, 95, 82, 108, 98, 126].map((height, index) => (
                <i key={`${height}-${index}`} style={{ height }} />
              ))}
            </div>
          </div>
          <div className="dash-panel">
            <h4>Top products</h4>
            <div className="mt-4 space-y-3">
              {[
                ["Creator OS", "84%"],
                ["Design Kit", "68%"],
                ["Launch Course", "52%"],
              ].map(([name, progress]) => (
                <div key={name}>
                  <div className="mb-1.5 flex justify-between text-[10px]"><span>{name}</span><span>{progress}</span></div>
                  <div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: progress }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function HyruxHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="hero-band">
        <header className="site-container flex h-24 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-9 text-sm md:flex" aria-label="Main navigation">
            {navItems.map(([label, href]) => <a key={href} href={href} className="nav-link">{label}</a>)}
          </nav>
          <Button asChild className="hidden rounded-full px-6 md:inline-flex"><a href="#connect">Join the horizon</a></Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </header>
        {menuOpen && (
          <nav className="site-container flex flex-col border-t border-ink/10 py-5 md:hidden" aria-label="Mobile navigation">
            {navItems.map(([label, href]) => <a key={href} href={href} className="py-3 text-lg" onClick={() => setMenuOpen(false)}>{label}</a>)}
          </nav>
        )}

        <div className="site-container relative flex min-h-[660px] flex-col items-center pt-16 text-center md:pt-20">
          <div className="hero-cloud hero-cloud-left" />
          <div className="hero-cloud hero-cloud-right" />
          <p className="eyebrow animate-rise">HORIZON OF DIGITAL CREATION</p>
          <h1 className="hero-title animate-rise-delay">
            Build what’s next.<br />
            <span>Own what you create.</span>
          </h1>
          <p className="hero-copy animate-rise-delay-2">
            The all-in-one operating system to design, launch, sell, and scale digital products—without the friction.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-rise-delay-2">
            <Button asChild size="lg" className="rounded-full px-6"><a href="#connect">Start building <ArrowRight /></a></Button>
            <Button asChild variant="secondary" size="lg" className="rounded-full px-6 shadow-none"><a href="#products"><Play className="fill-current" /> Explore products</a></Button>
          </div>
          <div className="relative z-10 mt-16 w-full animate-dashboard md:mt-20"><ProductDashboard /></div>
        </div>
      </section>

      <section className="trust-band">
        <p>Built for the people creating tomorrow’s digital economy</p>
        <div className="marquee" aria-label="Hyrux customers">
          <div className="marquee-track">
            {["CREATORS", "INDIE MAKERS", "AGENCIES", "SAAS FOUNDERS", "GLOBAL TEAMS", "CREATORS", "INDIE MAKERS", "AGENCIES", "SAAS FOUNDERS", "GLOBAL TEAMS"].map((item, index) => (
              <span key={`${item}-${index}`}><Sparkles className="size-3.5" /> {item}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="section-space bg-canvas">
        <div className="site-container grid gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-20">
          <div><p className="eyebrow">ONE IDEA. EVERY TOOL.</p></div>
          <div>
            <h2 className="section-title">From first spark to global scale, Hyrux keeps it all in one place.</h2>
            <p className="section-copy mt-7">Creators lose momentum stitching together page builders, payments, licensing, analytics, and communities. Hyrux replaces the patchwork with one beautifully connected system.</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {[["48h", "Idea to launch"], ["50+", "Payout currencies"], ["12", "Report languages"]].map(([value,label]) => (
                <div key={label} className="stat"><strong>{value}</strong><span>{label}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="section-space bg-surface">
        <div className="site-container">
          <div className="section-heading-row">
            <div><p className="eyebrow">THE HYRUX SYSTEM</p><h2 className="section-title mt-4">Everything your digital business needs.</h2></div>
            <p className="section-copy">Four connected products. One clear path from creation to growth.</p>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <article key={product.name} className="product-card group">
                  <div className={`product-visual ${product.tone}`}>
                    <span className="product-number">{product.number}</span>
                    <div className="product-icon"><Icon /></div>
                    <div className="visual-window">
                      <div className="flex items-center justify-between"><span className="text-xs font-semibold">Hyrux {product.name}</span><span className="size-2 rounded-full bg-primary" /></div>
                      <div className="mt-5 grid grid-cols-3 gap-2"><i /><i /><i /></div>
                      <div className="mt-2 h-16 rounded-sm bg-muted/70" />
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="eyebrow">{product.label}</p>
                    <h3 className="mt-4 text-3xl font-semibold">Hyrux {product.name}</h3>
                    <p className="mt-3 text-xl leading-snug">{product.title}</p>
                    <p className="mt-4 leading-relaxed text-muted-foreground">{product.copy}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {product.tags.map(tag => <li key={tag} className="feature-chip"><Check /> {tag}</li>)}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="connect-preview mt-4">
            <div className="relative z-10 max-w-xl">
              <p className="eyebrow text-primary-foreground/65">UPCOMING · HYRUX CONNECT</p>
              <h3 className="mt-5 text-4xl font-semibold text-primary-foreground md:text-5xl">Turn buyers into belonging.</h3>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-primary-foreground/70">Create a thriving membership around your products and turn one-time customers into a recurring community.</p>
              <Button asChild variant="secondary" size="lg" className="mt-8 rounded-full"><a href="#connect">Get early access <ArrowRight /></a></Button>
            </div>
            <div className="community-orbit" aria-hidden="true"><UsersRound /><span /><span /><span /></div>
          </div>
        </div>
      </section>

      <section id="vision" className="section-space bg-canvas">
        <div className="site-container">
          <p className="eyebrow">OUR NORTH STAR</p>
          <blockquote className="vision-quote">Anyone with an idea should be able to turn it into a sustainable digital business.</blockquote>
          <div className="mt-16 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
            {[
              [Sparkles, "Radical simplicity", "Powerful enough for enterprises. Clear enough for a first-time creator."],
              [Globe2, "Global by default", "Beautiful in every language, currency, and market from day one."],
              [LockKeyhole, "Privacy first", "Your work, customers, and business intelligence remain yours."],
            ].map(([Icon, title, copy]) => {
              const ValueIcon = Icon as typeof Sparkles;
              return <div className="value-cell" key={title as string}><ValueIcon /><h3>{title as string}</h3><p>{copy as string}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section className="global-band">
        <div className="site-container grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow text-primary-foreground/60">GLOBAL FROM THE BEGINNING</p>
            <h2 className="mt-5 text-5xl font-semibold leading-[1.03] text-primary-foreground md:text-6xl">One horizon.<br />Every language.</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-primary-foreground/65">Hyrux begins with the Sanskrit letter ह—the horizon, the beginning—and carries that spirit worldwide.</p>
          </div>
          <div className="language-list">
            {[["ह्यरुक्स", "Devanagari"], ["ハイラックス", "Japanese"], ["海睿克斯", "Chinese"], ["هيروكس", "Arabic"], ["Хайрукс", "Russian"], ["하이럭스", "Korean"]].map(([name, language]) => (
              <div key={language}><span>{name}</span><small>{language}</small></div>
            ))}
          </div>
        </div>
      </section>

      <section id="connect" className="cta-band">
        <div className="site-container text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-sm bg-primary text-2xl font-semibold text-primary-foreground">ह</div>
          <p className="eyebrow mt-8">THE HORIZON IS OPEN</p>
          <h2 className="mx-auto mt-5 max-w-4xl text-5xl font-semibold leading-none md:text-7xl">Build the digital business only you can imagine.</h2>
          <p className="mx-auto mt-7 max-w-xl text-lg text-muted-foreground">Hyrux is coming to creators, entrepreneurs, and teams building what comes next.</p>
          <Button asChild size="lg" className="mt-9 rounded-full px-7"><a href="mailto:hello@hyrux.com">Join the early access list <ArrowRight /></a></Button>
        </div>
      </section>

      <footer className="bg-canvas py-10">
        <div className="site-container flex flex-col gap-8 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <Logo />
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {navItems.map(([label, href]) => <a key={href} href={href} className="hover:text-foreground">{label}</a>)}
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Hyrux. Build the horizon.</p>
        </div>
      </footer>
    </div>
  );
}