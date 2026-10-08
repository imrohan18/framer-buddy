import { Fragment } from "react";

import "../legal.css";
import type { LegalBlock, LegalSection } from "../lib/legal-content";
import { MarketingShell } from "./marketing-shell";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

// Highlights unresolved [PLACEHOLDER] values so they are easy to spot and replace.
function renderText(text: string) {
  return text.split(/(\[[A-Z][A-Z0-9 &/-]*\])/g).map((part, index) =>
    /^\[[A-Z][A-Z0-9 &/-]*\]$/.test(part) ? (
      <span key={index} className="legal-placeholder">
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

function renderBlock(block: LegalBlock, index: number) {
  if (block.type === "h3") return <h3 key={index}>{block.text}</h3>;
  if (block.type === "ul") {
    return (
      <ul key={index}>
        {block.items.map((item) => (
          <li key={item}>{renderText(item)}</li>
        ))}
      </ul>
    );
  }
  return <p key={index}>{renderText(block.text)}</p>;
}

function TocList({ sections }: { sections: LegalSection[] }) {
  return (
    <ol className="legal-toc-list">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function LegalPage({ eyebrow, title, intro, sections }: LegalPageProps) {
  return (
    <MarketingShell eyebrow={eyebrow} title={title} description={intro}>
      <div className="legal-layout">
        <aside className="legal-toc-desktop" aria-label="Table of contents">
          <p className="legal-toc-title">ON THIS PAGE</p>
          <TocList sections={sections} />
        </aside>

        <div className="legal-content">
          <p className="legal-meta">
            Effective date: <span className="legal-placeholder">[EFFECTIVE DATE]</span>
          </p>

          <details className="legal-toc-mobile">
            <summary>On this page</summary>
            <TocList sections={sections} />
          </details>

          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="legal-section">
              <h2>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>
              {section.blocks.map(renderBlock)}
            </section>
          ))}

          <p className="legal-disclaimer">
            This document is a draft for HYRUX and should be reviewed by a qualified legal professional
            before it is treated as a definitive legal agreement.
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
