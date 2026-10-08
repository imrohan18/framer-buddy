import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { primaryNavigation } from "../lib/site-navigation";
import { SiteFooter } from "./site-footer";

type MarketingShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function MarketingShell({ eyebrow, title, description, children }: MarketingShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F4EF", color: "#0d0d0d" }}>
      <header className="navbar-wrapper animate-navbar">
        <div className="nav-pill navbar is-scrolled">
          <Link
            to="/"
            aria-label="Hyrux home"
            style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
          >
            <img
              src="/hyrux-logo-transparent.png"
              alt="Hyrux"
              style={{ height: 44, width: "auto" }}
            />
          </Link>
          <nav className="hidden items-center nav-links-list md:flex" aria-label="Main navigation">
            {primaryNavigation.map((item) => (
              <Link key={item.to} to={item.to} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/careers" className="nav-cta hidden md:inline-flex">
              Join the horizon
            </Link>
            <button
              className="md:hidden p-2.5 rounded-full hover:bg-black/5 transition"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="w-full max-w-[880px] px-4 pointer-events-auto mt-2">
            <nav className="rounded-2xl border border-white/60 bg-white/92 backdrop-blur-xl p-5 md:hidden shadow-2xl">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block py-2.5 text-base font-medium text-foreground hover:opacity-70 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/careers"
                className="nav-cta mt-3 w-full justify-center"
                onClick={() => setMenuOpen(false)}
              >
                Join the horizon
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main style={{ paddingTop: 104 }}>
        <section
          style={{
            background: "linear-gradient(180deg,#D8EAF4 0%, #F8F4EF 70%)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div className="site-container" style={{ padding: "84px 0 56px" }}>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                color: "rgba(13,13,13,0.45)",
                marginBottom: 14,
              }}
            >
              {eyebrow}
            </p>
            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3.6rem)",
                lineHeight: 1.03,
                letterSpacing: "-0.03em",
                marginBottom: 16,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                maxWidth: 720,
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: "rgba(13,13,13,0.62)",
              }}
            >
              {description}
            </p>
          </div>
        </section>

        <section>
          <div className="site-container" style={{ padding: "54px 0 80px" }}>
            {children}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
