import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "../components/legal-page";
import { privacyIntro, privacySections } from "../lib/legal-content";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — HYRUX" },
      { name: "description", content: privacyIntro },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage eyebrow="LEGAL" title="Privacy Policy" intro={privacyIntro} sections={privacySections} />
  );
}
