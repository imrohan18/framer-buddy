import { createFileRoute, Link } from "@tanstack/react-router";

import { MarketingShell } from "../components/marketing-shell";
import { listPublishedProjectsFn } from "../lib/cms/server-fns";

export const Route = createFileRoute("/projects")({
  loader: async () => {
    const projects = await listPublishedProjectsFn({ data: { limit: 120 } });
    return { projects };
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects } = Route.useLoaderData();

  return (
    <MarketingShell
      eyebrow="SELECTED WORK"
      title="Real projects built by HYRUX"
      description="Explore published case studies, custom software builds, full-stack products, and AI-powered solutions delivered for clients."
    >
      {projects.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.4rem" }}>No published projects yet</h2>
          <p className="admin-help-text">Published projects will appear here automatically.</p>
        </div>
      ) : (
        <div className="projects-public-grid">
          {projects.map((project) => (
            <article key={project.id} className="projects-public-card">
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="projects-public-image-wrap"
              >
                {project.mainImage ? (
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    loading="lazy"
                    className="projects-public-image"
                  />
                ) : (
                  <div className="projects-public-image placeholder">PROJECT SCREENSHOT</div>
                )}
              </Link>

              <p className="projects-public-meta">
                {project.featured ? "FEATURED" : "PROJECT"} / {project.category}
              </p>
              <h2 className="projects-public-title">{project.title}</h2>
              <p className="projects-public-description">{project.shortDescription}</p>

              <div className="projects-public-tags">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="selected-work-link"
              >
                View Project →
              </Link>
            </article>
          ))}
        </div>
      )}
    </MarketingShell>
  );
}
