import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, FileEdit, FolderOpen, Star } from "lucide-react";

import { AdminShell } from "../components/admin-shell";
import { formatDate } from "../lib/utils";
import { requireAdminRoute } from "../lib/cms/admin-guard";
import { getAdminDashboardFn, getAdminSessionFn } from "../lib/cms/server-fns";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: requireAdminRoute,
  loader: async () => {
    const [session, dashboard] = await Promise.all([getAdminSessionFn(), getAdminDashboardFn()]);
    return { session, dashboard };
  },
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { session, dashboard } = Route.useLoaderData();

  const cards = [
    { label: "Total Projects", value: dashboard.totals.totalProjects, Icon: FolderOpen, tone: "ink" },
    { label: "Published", value: dashboard.totals.published, Icon: CheckCircle2, tone: "green" },
    { label: "Drafts", value: dashboard.totals.drafts, Icon: FileEdit, tone: "amber" },
    { label: "Featured", value: dashboard.totals.featured, Icon: Star, tone: "rust" },
  ];

  return (
    <AdminShell
      current="dashboard"
      title="Dashboard"
      subtitle="Overview of publishing activity and recent project changes"
      sessionEmail={session?.email ?? "Admin"}
    >
      <section className="admin-stats-grid">
        {cards.map(({ label, value, Icon, tone }) => (
          <article key={label} className={`admin-stat-card tone-${tone}`}>
            <div className="admin-stat-head">
              <p>{label}</p>
              <span className="admin-stat-icon" aria-hidden="true">
                <Icon size={16} />
              </span>
            </div>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <h2>Recent Projects</h2>
          <Link to="/projects" className="admin-card-link">
            <span>View all</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentProjects.length === 0 ? (
                <tr>
                  <td colSpan={3} className="admin-empty-cell">
                    No projects yet.
                  </td>
                </tr>
              ) : (
                dashboard.recentProjects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <span className="admin-list-title">{project.title}</span>
                    </td>
                    <td>
                      <span className={`admin-status-pill ${project.status === "published" ? "published" : "draft"}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>{formatDate(project.updatedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
