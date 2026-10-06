import { createFileRoute, Link } from "@tanstack/react-router";

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
    <div style={{ minHeight: "100vh", background: "#F8F4EF" }}>
      <section style={{ background: "linear-gradient(180deg,#D8EAF4 0%, #F8F4EF 70%)" }}>
        <div className="site-container" style={{ padding: "110px 0 56px" }}>
          <p className="eyebrow">SELECTED WORK</p>
          <h1 className="section-title" style={{ marginTop: 12 }}>
            Real projects built by CYRUX
          </h1>
          <p className="section-copy" style={{ maxWidth: 760 }}>
            Explore published case studies, custom software builds, full-stack products, and
            AI-powered solutions delivered for clients.
          </p>
        </div>
      </section>

      <section className="section-space" style={{ background: "#F8F4EF", paddingTop: 34 }}>
        <div className="site-container">
          {projects.length === 0 ? (
            <div className="admin-card" style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "1.4rem" }}>No published projects yet</h2>
              <p className="admin-help-text">Published projects will appear here automatically.</p>
            </div>
          ) : (
            <div className="projects-public-grid">
              {projects.map((project) => (
                <article key={project.id} className="projects-public-card">
                  <Link to="/projects/$slug" params={{ slug: project.slug }} className="projects-public-image-wrap">
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

                  <Link to="/projects/$slug" params={{ slug: project.slug }} className="selected-work-link">
                    View Project →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
