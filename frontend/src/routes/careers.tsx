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
      <div style={{ display: "grid", gap: 12 }}>
        {roles.map((role) => (
          <article
            key={role}
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 14,
              background: "#fff",
              padding: "16px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontWeight: 600 }}>{role}</span>
            <Link
              to="/contact"
              style={{ textDecoration: "none", color: "#0d0d0d", fontWeight: 600 }}
            >
              Apply
            </Link>
          </article>
        ))}
      </div>
    </MarketingShell>
  );
}
