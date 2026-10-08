import { Check, Code, Compass, LifeBuoy, Palette, Pause, Play, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

import "./studio-showcase.css";

type Phase = {
  label: string;
  icon: typeof Code;
  status: string;
  title: string;
  chip: string;
  chartLabel: string;
  stats: { label: string; value: string; note: string }[];
  bars: number[];
  streams: { label: string; value: number }[];
};

const phases: Phase[] = [
  {
    label: "Discovery",
    icon: Compass,
    status: "Planning",
    title: "Understanding your idea",
    chip: "Weeks 1–2",
    chartLabel: "SCOPE CLARITY",
    stats: [
      { label: "Requirements", value: "12 / 12", note: "Signed off" },
      { label: "Workshops", value: "3", note: "Completed" },
      { label: "Scope", value: "100%", note: "Confirmed" },
    ],
    bars: [10, 18, 26, 38, 50, 60, 72, 80, 88, 94, 98, 100],
    streams: [
      { label: "Business analysis", value: 100 },
      { label: "User research", value: 90 },
      { label: "Technical planning", value: 85 },
      { label: "Quotation & timeline", value: 100 },
    ],
  },
  {
    label: "Design",
    icon: Palette,
    status: "Designing",
    title: "Shaping the experience",
    chip: "Weeks 3–4",
    chartLabel: "DESIGN APPROVALS",
    stats: [
      { label: "Screens", value: "18", note: "+6 this week" },
      { label: "Prototype", value: "v2", note: "Ready for review" },
      { label: "Approvals", value: "5 / 6", note: "On track" },
    ],
    bars: [8, 14, 22, 34, 40, 52, 58, 66, 74, 84, 92, 100],
    streams: [
      { label: "Wireframes", value: 100 },
      { label: "Visual design", value: 82 },
      { label: "Interactive prototype", value: 64 },
      { label: "Design system", value: 48 },
    ],
  },
  {
    label: "Development",
    icon: Code,
    status: "In development",
    title: "Your product, in progress",
    chip: "Sprint 4",
    chartLabel: "BUILD PROGRESS",
    stats: [
      { label: "Milestones", value: "6 / 8", note: "On track" },
      { label: "Deliverables", value: "24", note: "+3 this week" },
      { label: "Progress", value: "75%", note: "+12% this sprint" },
    ],
    bars: [22, 30, 28, 42, 48, 46, 60, 66, 70, 82, 88, 100],
    streams: [
      { label: "Frontend", value: 84 },
      { label: "Backend & APIs", value: 68 },
      { label: "Data & AI", value: 52 },
      { label: "Automation", value: 38 },
    ],
  },
  {
    label: "Launch",
    icon: Rocket,
    status: "Launching",
    title: "Going live",
    chip: "Final week",
    chartLabel: "LAUNCH READINESS",
    stats: [
      { label: "QA checks", value: "46 / 48", note: "Nearly done" },
      { label: "Performance", value: "96", note: "Lighthouse score" },
      { label: "Handover", value: "90%", note: "Docs & access" },
    ],
    bars: [30, 38, 46, 54, 60, 68, 74, 82, 88, 92, 96, 100],
    streams: [
      { label: "Testing & QA", value: 96 },
      { label: "Deployment", value: 88 },
      { label: "Security review", value: 92 },
      { label: "Handover", value: 90 },
    ],
  },
  {
    label: "Support",
    icon: LifeBuoy,
    status: "Live",
    title: "Supported after launch",
    chip: "Ongoing",
    chartLabel: "STABILITY",
    stats: [
      { label: "Uptime", value: "99.9%", note: "Last 30 days" },
      { label: "Open issues", value: "0", note: "All resolved" },
      { label: "Updates", value: "4", note: "Shipped this month" },
    ],
    bars: [90, 94, 92, 96, 98, 96, 100, 98, 100, 100, 99, 100],
    streams: [
      { label: "Monitoring", value: 100 },
      { label: "Bug fixes", value: 100 },
      { label: "Improvements", value: 60 },
      { label: "Reporting", value: 80 },
    ],
  },
];

const AUTOPLAY_MS = 3600;

export function StudioShowcase() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % phases.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  const active = phases[activeIndex];

  return (
    <div className="ss-window" aria-label="Interactive preview of a HYRUX project workspace">
      <div className="ss-topbar">
        <div className="ss-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="ss-address">hyrux.in / workspace / your-product</div>
        <div className="ss-status">
          <i aria-hidden="true" /> {active.status}
          <button
            type="button"
            className="ss-play"
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
            aria-pressed={playing}
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>
      </div>

      <div className="ss-body">
        <aside className="ss-sidebar">
          <p className="ss-label">PROJECT PHASES</p>
          <ol className="ss-phases">
            {phases.map(({ label, icon: Icon }, index) => {
              const state = index < activeIndex ? "done" : index === activeIndex ? "active" : "pending";
              return (
                <li key={label}>
                  <button
                    type="button"
                    className={`ss-phase is-${state}`}
                    aria-current={state === "active" ? "step" : undefined}
                    onClick={() => {
                      setPlaying(false);
                      setActiveIndex(index);
                    }}
                  >
                    <span className="ss-phase-mark">
                      {state === "done" ? <Check size={12} /> : <Icon size={12} />}
                    </span>
                    {label}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="ss-note">
            <strong>From idea to launch</strong>
            <span>Design, engineering, data, and AI in one team.</span>
          </div>
        </aside>

        <div className="ss-main" key={activeIndex}>
          <div className="ss-main-head">
            <div>
              <p className="ss-label">PROJECT</p>
              <h3>{active.title}</h3>
            </div>
            <span className="ss-chip">{active.chip}</span>
          </div>

          <div className="ss-stats">
            {active.stats.map((stat) => (
              <div key={stat.label} className="ss-stat">
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
                <span>{stat.note}</span>
              </div>
            ))}
          </div>

          <div className="ss-panels">
            <div className="ss-panel">
              <div className="ss-panel-head">
                <p className="ss-label">{active.chartLabel}</p>
                <span className="ss-chip">Last 12 weeks</span>
              </div>
              <div className="ss-bars" aria-hidden="true">
                {active.bars.map((height, index) => (
                  <i
                    key={index}
                    className={index === active.bars.length - 1 ? "is-current" : undefined}
                    style={{ height: `${height}%`, animationDelay: `${index * 30}ms` }}
                  />
                ))}
              </div>
            </div>

            <div className="ss-panel">
              <p className="ss-label">WORKSTREAMS</p>
              <div className="ss-streams">
                {active.streams.map(({ label, value }) => (
                  <div key={label}>
                    <div className="ss-stream-row">
                      <span>{label}</span>
                      <strong>{value}%</strong>
                    </div>
                    <div className="ss-track">
                      <div style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
