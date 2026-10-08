import { Link } from "@tanstack/react-router";

import { primaryNavigation } from "../lib/site-navigation";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer-inner">
        <div className="site-footer-main">
          <span className="site-footer-brand">Hyrux · Horizon of Digital Creation</span>
          <nav className="site-footer-links" aria-label="Footer navigation">
            {primaryNavigation.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="site-footer-bottom" aria-label="Legal links">
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  );
}