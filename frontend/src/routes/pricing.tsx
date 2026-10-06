import { createFileRoute } from "@tanstack/react-router";

import { MarketingShell } from "../components/marketing-shell";
import { PricingSection } from "../components/pricing-section";
import { listPricingPackagesFn } from "../lib/cms/server-fns";

export const Route = createFileRoute("/pricing")({
  loader: async () => {
    try {
      const packages = await listPricingPackagesFn();
      return { packages };
    } catch {
      return { packages: [] };
    }
  },
  component: PricingPage,
});

function PricingPage() {
  const { packages } = Route.useLoaderData();

  return (
    <MarketingShell
      eyebrow="PRICING"
      title="Start small. Build bigger."
      description="Choose a ready-to-start package or tell us what you need. We'll help you find the right way to build it."
    >
      <PricingSection packages={packages} />
    </MarketingShell>
  );
}
