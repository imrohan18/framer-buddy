import { createFileRoute } from "@tanstack/react-router";

import { MarketingShell } from "../components/marketing-shell";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <MarketingShell
      eyebrow="CONTACT"
      title="Tell us what you are building."
      description="Share your product idea and use case. We are onboarding early creators and teams for Hyrux access."
    >
      <div
        style={{
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 18,
          background: "#fff",
          padding: "28px",
          maxWidth: 760,
        }}
      >
        <p style={{ marginBottom: 16, color: "rgba(13,13,13,0.68)", lineHeight: 1.75 }}>
          For early access, partnership opportunities, and product questions, reach out at:
        </p>
        <a
          href="mailto:hello@hyrux.com"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.12)",
            padding: "10px 18px",
            fontWeight: 650,
            color: "#0d0d0d",
          }}
        >
          hello@hyrux.com
        </a>
      </div>
    </MarketingShell>
  );
}
