import { createLazyFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { MarketingShell } from "../components/marketing-shell";

export const Route = createLazyFileRoute("/products")({
  component: RouteComponent,
});

const featuredProject = {
  number: "01",
  category: "FULL-STACK PRODUCT",
  name: "Project Management Platform",
  description:
    "A full-stack platform designed to help teams manage projects, organize tasks, and collaborate through a centralized workspace.",
  technology: ["React", "Node.js", "Express", "MongoDB"],
};

const gridProjects = [
  {
    number: "02",
    category: "DIGITAL EXPERIENCE",
    name: "Business Website",
    description:
      "Modern, conversion-focused website designed to establish credibility and help a business reach more customers online.",
    technology: ["Next.js", "React", "Tailwind CSS"],
    tone: "web",
  },
  {
    number: "03",
    category: "AI & MACHINE LEARNING",
    name: "AI-Powered Solution",
    description:
      "An intelligent application designed to transform data into useful insights and practical outcomes.",
    technology: ["Python", "TensorFlow", "AI/ML"],
    tone: "ai",
  },
];

const customSoftwareProject = {
  number: "04",
  category: "CUSTOM SOFTWARE",
  name: "Custom Business Platform",
  description:
    "A tailored digital platform built around a client's workflow, helping simplify operations and bring important business processes into one place.",
  technology: ["React", "Node.js", "APIs", "Database"],
};

const capabilities = [
  "WEB DEVELOPMENT",
  "FULL-STACK APPLICATIONS",
  "CUSTOM SOFTWARE",
  "DATA & ANALYTICS",
  "AI / ML",
  "AUTOMATION",
];

function useReveal<T extends HTMLElement>(threshold = 0.2) {
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
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, isVisible]);

  return [ref, isVisible] as const;
}

function BrowserMockup({ accent, featured = false }: { accent: "web" | "ai" | "platform"; featured?: boolean }) {
  return (
    <div className={`portfolio-browser-shell ${featured ? "is-featured" : ""}`}>
      <div className="portfolio-browser-top">
        <span />
        <span />
        <span />
      </div>
      <div className={`portfolio-browser-screen ${accent === "ai" ? "is-ai" : accent === "platform" ? "is-platform" : "is-web"}`}>
        <div className="portfolio-browser-glow" />
        <div className="portfolio-browser-placeholder">PROJECT SCREENSHOT</div>
      </div>
    </div>
  );
}

function RouteComponent() {
  const [workRef, workVisible] = useReveal<HTMLElement>(0.14);
  const [proofRef, proofVisible] = useReveal<HTMLElement>(0.3);
  const [deliveredCount, setDeliveredCount] = useState(0);

  useEffect(() => {
    if (!proofVisible) return;

    const target = 50;
    const duration = 900;
    const start = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDeliveredCount(Math.round(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [proofVisible]);

  return (
    <MarketingShell
      eyebrow="SELECTED WORK"
      title="We don't just talk about ideas. We build them."
      description="From business websites and full-stack applications to custom software, data solutions, and AI-powered products, we've helped turn ideas into real digital experiences."
    >
      <section
        ref={workRef}
        className={`portfolio-work-section studio-reveal ${workVisible ? "is-visible" : ""}`}
      >
        <p className={`portfolio-proof-mini ${workVisible ? "is-visible" : ""}`}>
          50+ PRODUCTS DELIVERED
        </p>

        <article className={`portfolio-project portfolio-featured ${workVisible ? "is-visible" : ""}`}>
          <div className="portfolio-project-copy">
            <p className={`portfolio-project-meta ${workVisible ? "is-visible" : ""}`}>
              <span className="portfolio-project-number">{featuredProject.number}</span>
              <span className="portfolio-project-divider">/</span>
              <span>{featuredProject.category}</span>
            </p>
            <h2 className="portfolio-project-name">{featuredProject.name}</h2>
            <p className="portfolio-project-description">{featuredProject.description}</p>
            <ul className="portfolio-tech-list" aria-label="Project technology">
              {featuredProject.technology.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <a href="/contact" className="portfolio-project-link">
              View Project <ArrowRight size={15} />
            </a>
          </div>
          <div className="portfolio-project-visual">
            <BrowserMockup accent="platform" featured />
          </div>
        </article>

        <div className="portfolio-grid-two">
          {gridProjects.map((project, index) => (
            <article
              key={project.name}
              className={`portfolio-project portfolio-grid-item ${workVisible ? "is-visible" : ""}`}
              style={{ transitionDelay: `${140 + index * 90}ms` }}
            >
              <div className="portfolio-project-visual">
                <BrowserMockup accent={project.tone as "web" | "ai"} />
              </div>
              <div className="portfolio-project-copy">
                <p className={`portfolio-project-meta ${workVisible ? "is-visible" : ""}`}>
                  <span className="portfolio-project-number">{project.number}</span>
                  <span className="portfolio-project-divider">/</span>
                  <span>{project.category}</span>
                </p>
                <h3 className="portfolio-project-name">{project.name}</h3>
                <p className="portfolio-project-description">{project.description}</p>
                <ul className="portfolio-tech-list" aria-label="Project technology">
                  {project.technology.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <a href="/contact" className="portfolio-project-link">
                  View Project <ArrowRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <article className={`portfolio-project portfolio-wide ${workVisible ? "is-visible" : ""}`}>
          <div className="portfolio-project-visual">
            <BrowserMockup accent="web" featured />
          </div>
          <div className="portfolio-project-copy">
            <p className={`portfolio-project-meta ${workVisible ? "is-visible" : ""}`}>
              <span className="portfolio-project-number">{customSoftwareProject.number}</span>
              <span className="portfolio-project-divider">/</span>
              <span>{customSoftwareProject.category}</span>
            </p>
            <h3 className="portfolio-project-name">{customSoftwareProject.name}</h3>
            <p className="portfolio-project-description">{customSoftwareProject.description}</p>
            <ul className="portfolio-tech-list" aria-label="Project technology">
              {customSoftwareProject.technology.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <a href="/contact" className="portfolio-project-link">
              View Project <ArrowRight size={15} />
            </a>
          </div>
        </article>
      </section>

      <section
        ref={proofRef}
        className={`portfolio-proof-block studio-reveal ${proofVisible ? "is-visible" : ""}`}
      >
        <p className={`portfolio-proof-value ${proofVisible ? "is-visible" : ""}`}>
          {deliveredCount}+
        </p>
        <p className="portfolio-proof-title">PRODUCTS DELIVERED</p>
        <p className="portfolio-proof-copy">
          Different businesses. Different challenges.
          <br />
          One team focused on turning ideas into technology that works.
        </p>
        <ul className="portfolio-capability-list" aria-label="CYRUX capabilities">
          {capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
      </section>
    </MarketingShell>
  );
}
