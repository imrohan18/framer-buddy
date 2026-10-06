import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Box,
  Brain,
  Check,
  Globe2,
  Layers3,
  MousePointer2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { MarketingShell } from "../components/marketing-shell";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

type Capability = {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  Icon: typeof Globe2;
};

type WorkStep = {
  step: string;
  title: string;
  description: string;
  Icon: typeof MousePointer2;
};

const capabilities: Capability[] = [
  {
    title: "Digital Experiences",
    subtitle: "Websites & Web Platforms",
    description:
      "High-performance websites and web experiences designed to make businesses look credible, communicate clearly, and convert visitors into customers.",
    tags: ["Websites", "UI/UX", "E-Commerce", "Landing Pages"],
    Icon: Globe2,
  },
  {
    title: "Product Engineering",
    subtitle: "Full-Stack Development",
    description:
      "End-to-end development of web applications, SaaS platforms, dashboards, and custom software built around real business requirements.",
    tags: ["React", "Node.js", "Next.js", "APIs", "Cloud"],
    Icon: Layers3,
  },
  {
    title: "Data & Intelligence",
    subtitle: "Analytics & AI",
    description:
      "Turn your data into insights and intelligent systems through business analysis, data analytics, automation, and AI/ML solutions.",
    tags: ["Data Analytics", "Business Analysis", "AI/ML", "Automation"],
    Icon: Brain,
  },
  {
    title: "Custom Solutions",
    subtitle: "Software Built Around You",
    description:
      "When off-the-shelf tools are not enough, we build tailored software that fits your workflows, customers, and long-term goals.",
    tags: ["Custom Software", "Dashboards", "Integrations", "Internal Tools"],
    Icon: Box,
  },
];

const processStages = ["IDEA", "STRATEGY", "DESIGN", "ENGINEERING", "DATA + AI", "LAUNCH", "GROW"];

const workSteps: WorkStep[] = [
  {
    step: "01",
    title: "Discover",
    description:
      "We understand your business, users, goals, and the problem you are trying to solve.",
    Icon: MousePointer2,
  },
  {
    step: "02",
    title: "Define",
    description: "We turn requirements into a clear product strategy and technical roadmap.",
    Icon: Sparkles,
  },
  {
    step: "03",
    title: "Build",
    description: "Our team handles design, development, integrations, data, and AI where required.",
    Icon: Layers3,
  },
  {
    step: "04",
    title: "Launch",
    description: "We deploy, test, optimize, and help you take the product into the real world.",
    Icon: Zap,
  },
];

function useReveal<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, isVisible]);

  return [ref, isVisible] as const;
}

function AboutPage() {
  const [capabilityRef, capabilityVisible] = useReveal<HTMLDivElement>(0.2);
  const [proofRef, proofVisible] = useReveal<HTMLElement>(0.35);
  const [visionRef, visionVisible] = useReveal<HTMLElement>(0.25);
  const [workRef, workVisible] = useReveal<HTMLElement>(0.25);
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    if (!proofVisible) return;

    const target = 50;
    const durationMs = 900;
    const start = performance.now();
    let frameId = 0;

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setProductsCount(Math.round(target * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [proofVisible]);

  return (
    <MarketingShell
      eyebrow="ABOUT CYRUX"
      title="We build the technology behind ambitious ideas."
      description="From a first concept to a product used by real customers, CYRUX helps businesses design, build, and scale digital solutions. We combine product strategy, engineering, data, and AI to turn ideas into technology that works."
    >
      <div
        ref={capabilityRef}
        className={`studio-capability-grid studio-reveal ${capabilityVisible ? "is-visible" : ""}`}
      >
        {capabilities.map((capability, index) => (
          <article
            key={capability.title}
            className={`studio-capability-card ${capabilityVisible ? "is-visible" : ""}`}
            style={{ transitionDelay: `${index * 70}ms` }}
          >
            <div className="studio-capability-icon">
              <capability.Icon size={18} />
            </div>
            <p className="studio-capability-subtitle">{capability.subtitle}</p>
            <h3 className="studio-capability-title">{capability.title}</h3>
            <p className="studio-capability-description">{capability.description}</p>
            <div className="studio-tag-row">
              {capability.tags.map((tag) => (
                <span key={tag} className="studio-tag">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section
        ref={proofRef}
        className={`studio-proof-band studio-reveal ${proofVisible ? "is-visible" : ""}`}
      >
        <p className={`studio-proof-number ${proofVisible ? "is-visible" : ""}`}>
          {productsCount}+
        </p>
        <p className="studio-proof-label">PRODUCTS DELIVERED</p>
        <p className="studio-proof-kicker">
          Built for different businesses. Built for different problems.
        </p>
        <p className="studio-proof-description">
          Every project starts with a different challenge. Our job is to understand it, find the
          right technology, and deliver something that creates real value.
        </p>
        <div className="studio-proof-meta">
          {["Products Delivered", "Client Solutions", "End-to-End Delivery"].map((label) => (
            <span key={label} className="studio-proof-chip">
              <Check size={12} /> {label}
            </span>
          ))}
        </div>
      </section>

      <section
        ref={visionRef}
        className={`studio-vision-block studio-reveal ${visionVisible ? "is-visible" : ""}`}
      >
        <p className="eyebrow">OUR VISION</p>
        <h2 className="studio-section-heading">
          Technology should solve problems, not create more of them.
        </h2>
        <p className="studio-section-copy">
          We believe businesses should not have to navigate complicated technology to move forward.
          Our vision is to make high-quality digital products, data, and AI accessible to businesses
          of every size - helping them work smarter, reach more customers, and build what comes
          next.
        </p>

        <div className="studio-process-wrap">
          <ol className="studio-process-track" aria-label="CYRUX product process">
            {processStages.map((stage, index) => (
              <li
                key={stage}
                className={`studio-process-item ${visionVisible ? "is-visible" : ""}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <span className="studio-process-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="studio-process-label">{stage}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        ref={workRef}
        className={`studio-work-block studio-reveal ${workVisible ? "is-visible" : ""}`}
      >
        <p className="eyebrow">HOW WE WORK</p>
        <h2 className="studio-section-heading">One idea. One team. From start to launch.</h2>
        <div className="studio-work-grid">
          {workSteps.map((item, index) => (
            <article
              key={item.step}
              className={`studio-work-card ${workVisible ? "is-visible" : ""}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="studio-work-top">
                <span className="studio-work-step">{item.step}</span>
                <item.Icon size={18} />
              </div>
              <h3 className="studio-work-title">{item.title}</h3>
              <p className="studio-work-description">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-end-note">
        <div className="studio-end-note-shell">
          <BarChart3 size={18} />
          <p>
            CYRUX helps businesses turn ideas into websites, software, data solutions, and
            AI-powered products.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
