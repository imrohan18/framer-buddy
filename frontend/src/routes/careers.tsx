import { createFileRoute, Link } from "@tanstack/react-router";

import { MarketingShell } from "../components/marketing-shell";

export const Route = createFileRoute("/careers")({
  component: CareersPage,
});

function CareersPage() {
  const roles = ["Frontend Engineer (React)", "Product Designer", "Developer Relations Lead"];

  return (
    <MarketingShell
      eyebrow="CAREERS"
      title="Join the team shaping the next creator operating system."
      description="We are building the product platform we always wanted as creators. If you care about design quality, velocity, and ownership, we should talk."
    >
      <div className="careers-list">
        {roles.map((role) => (
          <article key={role} className="careers-role">
            <span className="careers-role-title">{role}</span>
            <Link
              to="/contact"
              className="careers-apply"
            >
              Apply
            </Link>
          </article>
        ))}
      </div>
    </MarketingShell>
  );
}
