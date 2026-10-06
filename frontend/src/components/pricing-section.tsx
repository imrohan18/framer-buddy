import { ArrowRight, Check, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { listPricingPackagesFn, submitProjectInquiryFn } from "../lib/cms/server-fns";
import {
  INQUIRY_BUDGET_RANGES,
  INQUIRY_PROJECT_TYPES,
  type PricingPackage,
} from "../lib/cms/types";

/**
 * Fallback content used when the CMS has no active packages configured.
 * Mirrors the seeded defaults so the section is never empty.
 */
export const defaultPricingPackages: PricingPackage[] = [
  {
    id: "starting-package",
    badge: "STARTING PACKAGE",
    title: "Software / Full-Stack Project",
    price: "₹4,999",
    priceLabel: "Starting at",
    description:
      "A ready-to-start development package for businesses, students, startups, and individuals who need a complete digital project.",
    features: [
      "Software projects",
      "Full-stack development",
      "Project delivery",
      "Clear project scope",
      "Details and deliverables provided",
    ],
    ctaText: "View What's Included",
    ctaType: "details",
    pdfUrl: null,
    detailsUrl: null,
    active: true,
    featured: true,
    displayOrder: 10,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "custom-project",
    badge: "FOR UNIQUE REQUIREMENTS",
    title: "Custom Project",
    price: "Custom",
    priceLabel: null,
    description:
      "Have a bigger idea or specific requirements? Tell us what you're building and we'll discuss the right solution for you.",
    features: [
      "Custom software",
      "Business websites",
      "Full-stack applications",
      "SaaS platforms",
      "AI / ML solutions",
      "Data & analytics",
      "Business automation",
    ],
    ctaText: "Discuss Your Project",
    ctaType: "inquiry",
    pdfUrl: null,
    detailsUrl: null,
    active: true,
    featured: false,
    displayOrder: 20,
    createdAt: "",
    updatedAt: "",
  },
];

function openConfiguredUrl(url: string) {
  if (/^https?:\/\//i.test(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    window.location.assign(url);
  }
}

type PricingSectionProps = {
  packages?: PricingPackage[];
};

export function PricingSection({ packages }: PricingSectionProps) {
  const [livePackages, setLivePackages] = useState<PricingPackage[] | null>(packages ?? null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [detailsPackage, setDetailsPackage] = useState<PricingPackage | null>(null);

  useEffect(() => {
    if (packages && packages.length > 0) {
      setLivePackages(packages);
      return;
    }

    let mounted = true;
    void (async () => {
      try {
        const result = await listPricingPackagesFn();
        if (mounted && Array.isArray(result)) {
          setLivePackages(result);
        }
      } catch {
        if (mounted) {
          setLivePackages((previous) => previous ?? []);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [packages]);

  const cards = livePackages && livePackages.length > 0 ? livePackages : defaultPricingPackages;

  const handleCta = (pkg: PricingPackage) => {
    if (pkg.ctaType === "inquiry") {
      setInquiryOpen(true);
      return;
    }
    if (pkg.pdfUrl) {
      openConfiguredUrl(pkg.pdfUrl);
      return;
    }
    if (pkg.detailsUrl) {
      openConfiguredUrl(pkg.detailsUrl);
      return;
    }
    setDetailsPackage(pkg);
  };

  return (
    <>
      <div className="pricing-cards">
        {cards.map((pkg) => (
          <article
            key={pkg.id}
            className={`pricing-card ${pkg.featured ? "is-featured" : ""}`}
          >
            {pkg.badge ? <p className="pricing-card-badge">{pkg.badge}</p> : null}

            <div className="pricing-card-heading">
              <span className="pricing-card-price">{pkg.price}</span>
              {pkg.priceLabel ? (
                <span className="pricing-card-price-label">{pkg.priceLabel}</span>
              ) : null}
            </div>

            <h3 className="pricing-card-title">{pkg.title}</h3>
            <p className="pricing-card-desc">{pkg.description}</p>

            {pkg.features.length > 0 ? (
              <ul className="pricing-card-features">
                {pkg.features.map((feature) => (
                  <li key={feature} className="pricing-card-feature">
                    <span className="pricing-card-check" aria-hidden="true">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <button
              type="button"
              className={`pricing-cta ${pkg.featured ? "primary" : "secondary"}`}
              onClick={() => handleCta(pkg)}
            >
              <span>{pkg.ctaText}</span>
              <ArrowRight size={16} className="pricing-cta-arrow" aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>

      {detailsPackage ? (
        <Modal onClose={() => setDetailsPackage(null)} labelledBy="pricing-details-title">
          <div className="pricing-modal-head">
            <div>
              {detailsPackage.badge ? (
                <p className="pricing-card-badge">{detailsPackage.badge}</p>
              ) : null}
              <h2 id="pricing-details-title" className="pricing-modal-title">
                {detailsPackage.title}
              </h2>
              <p className="pricing-modal-price">
                {detailsPackage.priceLabel ? (
                  <span className="pricing-modal-price-label">{detailsPackage.priceLabel} </span>
                ) : null}
                <span className="pricing-modal-price-value">{detailsPackage.price}</span>
              </p>
            </div>
            <button
              type="button"
              className="pricing-modal-close"
              onClick={() => setDetailsPackage(null)}
              aria-label="Close package details"
            >
              <X size={18} />
            </button>
          </div>

          <p className="pricing-modal-copy">{detailsPackage.description}</p>

          {detailsPackage.features.length > 0 ? (
            <ul className="pricing-card-features pricing-modal-features">
              {detailsPackage.features.map((feature) => (
                <li key={feature} className="pricing-card-feature">
                  <span className="pricing-card-check" aria-hidden="true">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="pricing-modal-note">
            Full deliverable details are shared when we confirm your project. Tell us a bit about
            what you need and we&apos;ll guide you from there.
          </p>

          <div className="pricing-modal-actions">
            <button
              type="button"
              className="pricing-cta primary"
              onClick={() => {
                setDetailsPackage(null);
                setInquiryOpen(true);
              }}
            >
              <span>Discuss Your Project</span>
              <ArrowRight size={16} className="pricing-cta-arrow" aria-hidden="true" />
            </button>
          </div>
        </Modal>
      ) : null}

      {inquiryOpen ? <ProjectInquiryModal onClose={() => setInquiryOpen(false)} /> : null}
    </>
  );
}

/* ============================================================
   MODAL SHELL
   ============================================================ */
function Modal({
  children,
  onClose,
  labelledBy,
}: {
  children: ReactNode;
  onClose: () => void;
  labelledBy: string;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="pricing-modal-scrim"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="pricing-modal">{children}</div>
    </div>
  );
}

/* ============================================================
   PROJECT INQUIRY FORM
   ============================================================ */
type InquiryFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectDescription: string;
  projectType: string;
  budgetRange: string;
  message: string;
};

const emptyInquiryForm: InquiryFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  projectDescription: "",
  projectType: "",
  budgetRange: "",
  message: "",
};

function ProjectInquiryModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<InquiryFormState>(emptyInquiryForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof InquiryFormState, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitProjectInquiryFn({
        data: {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          company: form.company || undefined,
          projectDescription: form.projectDescription,
          projectType:
            (form.projectType as (typeof INQUIRY_PROJECT_TYPES)[number]) || undefined,
          budgetRange:
            (form.budgetRange as (typeof INQUIRY_BUDGET_RANGES)[number]) || undefined,
          message: form.message || undefined,
        },
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} labelledBy="pricing-inquiry-title">
      <div className="pricing-modal-head">
        <div>
          <p className="pricing-card-badge">CUSTOM PROJECT</p>
          <h2 id="pricing-inquiry-title" className="pricing-modal-title">
            Discuss your project
          </h2>
          <p className="pricing-modal-subtitle">
            Tell us what you&apos;re building and we&apos;ll get back to you soon.
          </p>
        </div>
        <button
          type="button"
          className="pricing-modal-close"
          onClick={onClose}
          aria-label="Close inquiry form"
        >
          <X size={18} />
        </button>
      </div>

      {submitted ? (
        <div className="pricing-inquiry-success">
          <span className="pricing-inquiry-success-mark" aria-hidden="true">
            <Check size={22} strokeWidth={2.5} />
          </span>
          <p>
            Thanks! We&apos;ve received your project details. We&apos;ll get back to you soon.
          </p>
          <button type="button" className="pricing-cta secondary" onClick={onClose}>
            <span>Close</span>
          </button>
        </div>
      ) : (
        <form className="pricing-form" onSubmit={onSubmit} noValidate>
          <div className="pricing-form-grid">
            <div className="pricing-field">
              <label htmlFor="inquiry-name">Name *</label>
              <input
                id="inquiry-name"
                type="text"
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="pricing-field">
              <label htmlFor="inquiry-email">Email *</label>
              <input
                id="inquiry-email"
                type="email"
                required
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="pricing-field">
              <label htmlFor="inquiry-phone">Phone / WhatsApp</label>
              <input
                id="inquiry-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                autoComplete="tel"
              />
            </div>
            <div className="pricing-field">
              <label htmlFor="inquiry-company">Company / Business</label>
              <input
                id="inquiry-company"
                type="text"
                value={form.company}
                onChange={(event) => update("company", event.target.value)}
                autoComplete="organization"
              />
            </div>
            <div className="pricing-field pricing-field-wide">
              <label htmlFor="inquiry-description">What do you want to build? *</label>
              <textarea
                id="inquiry-description"
                required
                rows={3}
                value={form.projectDescription}
                onChange={(event) => update("projectDescription", event.target.value)}
              />
            </div>
            <div className="pricing-field">
              <label htmlFor="inquiry-type">Project type</label>
              <select
                id="inquiry-type"
                value={form.projectType}
                onChange={(event) => update("projectType", event.target.value)}
              >
                <option value="">Select project type</option>
                {INQUIRY_PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="pricing-field">
              <label htmlFor="inquiry-budget">Budget range</label>
              <select
                id="inquiry-budget"
                value={form.budgetRange}
                onChange={(event) => update("budgetRange", event.target.value)}
              >
                <option value="">Select budget range</option>
                {INQUIRY_BUDGET_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
            <div className="pricing-field pricing-field-wide">
              <label htmlFor="inquiry-message">Message</label>
              <textarea
                id="inquiry-message"
                rows={3}
                value={form.message}
                onChange={(event) => update("message", event.target.value)}
              />
            </div>
          </div>

          {error ? <p className="pricing-form-error">{error}</p> : null}

          <button type="submit" className="pricing-cta primary pricing-form-submit" disabled={submitting}>
            <span>{submitting ? "Sending…" : "Send Project Inquiry"}</span>
            {!submitting ? (
              <ArrowRight size={16} className="pricing-cta-arrow" aria-hidden="true" />
            ) : null}
          </button>
        </form>
      )}
    </Modal>
  );
}
