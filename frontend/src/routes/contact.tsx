import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

import { MarketingShell } from "../components/marketing-shell";
import { submitProjectInquiryFn } from "../lib/cms/server-fns";
import { INQUIRY_BUDGET_RANGES, INQUIRY_PROJECT_TYPES } from "../lib/cms/types";

import "../contact.css";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectDescription: "",
    projectType: "",
    budgetRange: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await submitProjectInquiryFn({
        data: {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          company: form.company || undefined,
          projectDescription: form.projectDescription,
          projectType: (form.projectType as (typeof INQUIRY_PROJECT_TYPES)[number]) || undefined,
          budgetRange: (form.budgetRange as (typeof INQUIRY_BUDGET_RANGES)[number]) || undefined,
          message: form.message || undefined,
        },
      });
      setSubmitted(true);
    } catch {
      setError("We couldn't send your inquiry. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MarketingShell
      eyebrow="CONTACT"
      title="Let's talk about what you're building."
      description="Share a little about your business and the product or problem you want to work on."
    >
      <div className="contact-layout">
        <aside className="contact-aside">
          <p className="contact-aside-label">A GOOD PLACE TO START</p>
          <h2>One clear conversation can shape the whole project.</h2>
          <p>
            Whether you need a website, custom software, a SaaS product, or a practical AI solution,
            tell us where you are and what you want to make possible.
          </p>
          <a className="contact-email" href="mailto:hello@hyrux.com">
            <Mail size={16} /> hello@hyrux.com
          </a>
          <Link className="contact-careers" to="/careers">
            <span>Looking to work with us?</span>
            <strong>
              Join the team <ArrowRight size={15} />
            </strong>
          </Link>
        </aside>

        <div className="contact-form-panel">
          {submitted ? (
            <div className="contact-success" role="status">
              <span className="contact-success-icon">
                <Check size={22} />
              </span>
              <h2>Thanks for reaching out.</h2>
              <p>Your project inquiry has been received. We&apos;ll be in touch.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-heading">
                <h2>Project details</h2>
                <p>Fields marked with * are required.</p>
              </div>
              <div className="contact-form-grid">
                <div className="contact-field">
                  <label htmlFor="contact-name">Your name *</label>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={120}
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-email">Email address *</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={200}
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-company">Business or organization</label>
                  <input
                    id="contact-company"
                    name="company"
                    autoComplete="organization"
                    maxLength={160}
                    value={form.company}
                    onChange={(event) => update("company", event.target.value)}
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-phone">Phone (optional)</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={40}
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-project-type">What are you looking to build?</label>
                  <select
                    id="contact-project-type"
                    name="projectType"
                    value={form.projectType}
                    onChange={(event) => update("projectType", event.target.value)}
                  >
                    <option value="">Choose a project type</option>
                    {INQUIRY_PROJECT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-budget">Estimated budget</label>
                  <select
                    id="contact-budget"
                    name="budgetRange"
                    value={form.budgetRange}
                    onChange={(event) => update("budgetRange", event.target.value)}
                  >
                    <option value="">Choose a range</option>
                    {INQUIRY_BUDGET_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="contact-field contact-field-wide">
                  <label htmlFor="contact-description">Tell us about your project *</label>
                  <textarea
                    id="contact-description"
                    name="projectDescription"
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={5}
                    value={form.projectDescription}
                    onChange={(event) => update("projectDescription", event.target.value)}
                  />
                </div>
                <div className="contact-field contact-field-wide">
                  <label htmlFor="contact-message">Anything else we should know?</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    maxLength={5000}
                    rows={3}
                    value={form.message}
                    onChange={(event) => update("message", event.target.value)}
                  />
                </div>
              </div>
              {error ? (
                <p className="contact-form-error" role="alert">
                  {error}
                </p>
              ) : null}
              <button className="contact-submit" type="submit" disabled={submitting}>
                {submitting ? "Sending inquiry..." : "Send project inquiry"}
                {!submitting ? <ArrowRight size={16} /> : null}
              </button>
            </form>
          )}
        </div>
      </div>
    </MarketingShell>
  );
}
