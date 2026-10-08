import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "../components/legal-page";
import { termsIntro, termsSections } from "../lib/legal-content";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — HYRUX" },
      { name: "description", content: termsIntro },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage eyebrow="LEGAL" title="Terms & Conditions" intro={termsIntro} sections={termsSections} />
  );
}
