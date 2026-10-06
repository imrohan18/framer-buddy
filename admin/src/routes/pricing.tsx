import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AdminShell } from "../components/admin-shell";
import { requireAdminRoute } from "../lib/cms/admin-guard";
import {
  getAdminSessionFn,
  listPricingPackagesFn,
  updatePricingPackageFn,
} from "../lib/cms/server-fns";
import {
  PRICING_CTA_TYPES,
  type PricingCtaType,
  type PricingPackage,
} from "../lib/cms/types";

export const Route = createFileRoute("/pricing")({
  beforeLoad: requireAdminRoute,
  loader: async () => {
    const [session, packages] = await Promise.all([getAdminSessionFn(), listPricingPackagesFn()]);
    return { session, packages };
  },
  component: AdminPricingPage,
});

function AdminPricingPage() {
  const { session, packages } = Route.useLoaderData();
  const [items, setItems] = useState<PricingPackage[]>(packages);

  return (
    <AdminShell
      current="pricing"
      title="Pricing"
      subtitle="Manage the project packages shown on the public pricing section"
      sessionEmail={session?.email ?? "Admin"}
    >
      <section className="admin-card">
        <div className="admin-card-header">
          <h2>How pricing works</h2>
          <span className="admin-count-badge">{items.length} packages</span>
        </div>
        <p className="admin-help-text">
          The public pricing section shows every active package below. The starting package can link
          to a PDF or a details page, while the custom option opens the project inquiry form.
        </p>
      </section>

      <div className="admin-pricing-editors">
        {items.map((pkg) => (
          <PackageEditor
            key={pkg.id}
            pkg={pkg}
            onSaved={(updated) =>
              setItems((previous) =>
                previous.map((item) => (item.id === updated.id ? updated : item)),
              )
            }
          />
        ))}
      </div>
    </AdminShell>
  );
}

type PackageFormState = {
  badge: string;
  title: string;
  price: string;
  priceLabel: string;
  description: string;
  features: string;
  ctaText: string;
  ctaType: PricingCtaType;
  pdfUrl: string;
  detailsUrl: string;
  active: boolean;
  featured: boolean;
  displayOrder: string;
};

function toFormState(pkg: PricingPackage): PackageFormState {
  return {
    badge: pkg.badge ?? "",
    title: pkg.title,
    price: pkg.price,
    priceLabel: pkg.priceLabel ?? "",
    description: pkg.description,
    features: pkg.features.join("\n"),
    ctaText: pkg.ctaText,
    ctaType: pkg.ctaType,
    pdfUrl: pkg.pdfUrl ?? "",
    detailsUrl: pkg.detailsUrl ?? "",
    active: pkg.active,
    featured: pkg.featured,
    displayOrder: String(pkg.displayOrder),
  };
}

function PackageEditor({
  pkg,
  onSaved,
}: {
  pkg: PricingPackage;
  onSaved: (updated: PricingPackage) => void;
}) {
  const [form, setForm] = useState<PackageFormState>(() => toFormState(pkg));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const set = <K extends keyof PackageFormState>(key: K, value: PackageFormState[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const features = form.features
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean);

      const updated = await updatePricingPackageFn({
        data: {
          id: pkg.id,
          input: {
            badge: form.badge || undefined,
            title: form.title,
            price: form.price,
            priceLabel: form.priceLabel || undefined,
            description: form.description,
            features,
            ctaText: form.ctaText,
            ctaType: form.ctaType,
            pdfUrl: form.pdfUrl || undefined,
            detailsUrl: form.detailsUrl || undefined,
            active: form.active,
            featured: form.featured,
            displayOrder: Number.parseInt(form.displayOrder, 10) || 0,
          },
        },
      });

      onSaved(updated);
      setForm(toFormState(updated));
      setMessage({ tone: "success", text: "Package updated." });
    } catch {
      setMessage({ tone: "error", text: "Could not save the package. Check the fields and retry." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>{pkg.title}</h2>
        <span className={`admin-status-pill ${form.active ? "published" : "draft"}`}>
          {form.active ? "Active" : "Inactive"}
        </span>
      </div>

      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-form-grid two-col">
          <label>
            <span>Badge / eyebrow</span>
            <input
              type="text"
              value={form.badge}
              maxLength={60}
              onChange={(event) => set("badge", event.target.value)}
              placeholder="STARTING PACKAGE"
            />
          </label>
          <label>
            <span>Display order</span>
            <input
              type="number"
              min={0}
              max={9999}
              value={form.displayOrder}
              onChange={(event) => set("displayOrder", event.target.value)}
            />
          </label>
          <label>
            <span>Title</span>
            <input
              type="text"
              required
              value={form.title}
              onChange={(event) => set("title", event.target.value)}
            />
          </label>
          <label>
            <span>Price</span>
            <input
              type="text"
              required
              value={form.price}
              onChange={(event) => set("price", event.target.value)}
              placeholder="₹4,999"
            />
          </label>
          <label>
            <span>Price label</span>
            <input
              type="text"
              value={form.priceLabel}
              maxLength={60}
              onChange={(event) => set("priceLabel", event.target.value)}
              placeholder="Starting at"
            />
          </label>
          <label>
            <span>CTA text</span>
            <input
              type="text"
              required
              value={form.ctaText}
              onChange={(event) => set("ctaText", event.target.value)}
              placeholder="View What's Included"
            />
          </label>
        </div>

        <label className="admin-field-stack">
          <span>Description</span>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
          />
        </label>

        <label className="admin-field-stack">
          <span>Features (one per line)</span>
          <textarea
            rows={7}
            value={form.features}
            onChange={(event) => set("features", event.target.value)}
            placeholder={"Software projects\nFull-stack development"}
          />
        </label>

        <div className="admin-form-grid two-col">
          <label>
            <span>CTA action</span>
            <select
              value={form.ctaType}
              onChange={(event) => set("ctaType", event.target.value as PricingCtaType)}
            >
              {PRICING_CTA_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === "pdf"
                    ? "Open PDF"
                    : type === "details"
                      ? "Open details page"
                      : "Open inquiry form"}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>PDF URL</span>
            <input
              type="text"
              value={form.pdfUrl}
              onChange={(event) => set("pdfUrl", event.target.value)}
              placeholder="/uploads/package.pdf or https://…"
            />
          </label>
          <label>
            <span>Details page URL</span>
            <input
              type="text"
              value={form.detailsUrl}
              onChange={(event) => set("detailsUrl", event.target.value)}
              placeholder="/package-details or https://…"
            />
          </label>
          <div className="admin-pricing-toggles">
            <label className="admin-checkbox-row">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => set("active", event.target.checked)}
              />
              <span>Active on site</span>
            </label>
            <label className="admin-checkbox-row">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => set("featured", event.target.checked)}
              />
              <span>Highlight as primary</span>
            </label>
          </div>
        </div>

        {message ? (
          <p className={`admin-form-message ${message.tone === "success" ? "is-success" : "is-error"}`}>
            {message.text}
          </p>
        ) : null}

        <div className="admin-form-actions">
          <button type="submit" className="admin-primary-btn" disabled={saving}>
            {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
            <span>{saving ? "Saving…" : "Save package"}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
