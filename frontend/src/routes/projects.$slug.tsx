import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { getProjectBySlugFn } from "../lib/cms/server-fns";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const project = await getProjectBySlugFn({ data: { slug: params.slug } });
    if (!project) {
      throw notFound();
    }
    return { project };
  },
  head: ({ loaderData, params }) => {
    const project = loaderData?.project;
    const title = project ? `${project.title} | CYRUX` : `Project | CYRUX`;
    const description = project
      ? `Explore the ${project.title} built by CYRUX.`
      : "Explore CYRUX project case studies.";
    const canonical = `/projects/${params.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(project?.mainImage ? [{ property: "og:image", content: project.mainImage }] : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { project } = Route.useLoaderData();

  return (
    <div style={{ minHeight: "100vh", background: "#F8F4EF" }}>
      <section style={{ background: "linear-gradient(180deg,#D8EAF4 0%, #F8F4EF 74%)" }}>
        <div className="site-container" style={{ padding: "106px 0 40px" }}>
          <p className="eyebrow">
            {project.category} {project.year ? `· ${project.year}` : ""}
          </p>
          <h1 className="section-title" style={{ marginTop: 10 }}>
            {project.title}
          </h1>
          <p className="section-copy" style={{ maxWidth: 760 }}>
            {project.shortDescription}
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 52px", background: "#F8F4EF" }}>
        <div className="site-container">
          {project.mainImage ? (
            <img src={project.mainImage} alt={project.title} className="project-detail-hero" />
          ) : (
            <div className="project-detail-hero placeholder">PROJECT SCREENSHOT</div>
          )}
        </div>
      </section>

      <section className="section-space" style={{ paddingTop: 18 }}>
        <div className="site-container project-detail-grid">
          <article className="admin-card">
            <h2>Technology Stack</h2>
            <div className="projects-public-tags" style={{ marginTop: 14 }}>
              {project.technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>

            {(project.projectUrl || project.githubUrl || project.caseStudyUrl) && (
              <div className="project-detail-links">
                {project.projectUrl ? (
                  <a href={project.projectUrl} target="_blank" rel="noreferrer">
                    Live Project
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                ) : null}
                {project.caseStudyUrl ? (
                  <a href={project.caseStudyUrl} target="_blank" rel="noreferrer">
                    Case Study
                  </a>
                ) : null}
              </div>
            )}
          </article>

          <article className="admin-card">
            <h2>Project Details</h2>
            <p className="project-detail-markdown">{project.description}</p>
          </article>
        </div>
      </section>

      {project.galleryImages.length > 0 ? (
        <section style={{ padding: "0 0 88px", background: "#F8F4EF" }}>
          <div className="site-container">
            <h2 className="section-title" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
              Gallery
            </h2>
            <div className="project-gallery-grid">
              {project.galleryImages.map((image) => (
                <img key={image} src={image} alt={`${project.title} gallery`} loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-space" style={{ background: "#EFF5F9", textAlign: "center" }}>
        <div className="site-container">
          <h2 className="section-title" style={{ marginBottom: 8 }}>
            Have an idea worth building?
          </h2>
          <p className="section-copy" style={{ marginInline: "auto", maxWidth: 560 }}>
            Start a Project →
          </p>
          <Link to="/contact" className="selected-work-link" style={{ marginTop: 18 }}>
            Start a Project →
          </Link>
        </div>
      </section>
    </div>
  );
}
