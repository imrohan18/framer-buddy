import { createFileRoute } from "@tanstack/react-router";
import { Copy, Edit3, Eye, EyeOff, Loader2, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { AdminShell } from "../../components/admin-shell";
import { formatDate } from "../../lib/utils";
import { PROJECT_CATEGORIES } from "../../lib/cms/categories";
import { requireAdminRoute } from "../../lib/cms/admin-guard";
import {
  deleteProjectFn,
  duplicateProjectFn,
  getAdminSessionFn,
  listAdminProjectsFn,
  setProjectStatusFn,
} from "../../lib/cms/server-fns";
import type { ProjectListItem } from "../../lib/cms/types";

export const Route = createFileRoute("/projects/")({
  beforeLoad: requireAdminRoute,
  loader: async () => {
    const [session, projects] = await Promise.all([
      getAdminSessionFn(),
      listAdminProjectsFn({ data: { sort: "newest" } }),
    ]);
    return { session, projects };
  },
  component: AdminProjectsPage,
});

function AdminProjectsPage() {
  const { session, projects: initialProjects } = Route.useLoaderData();

  const [projects, setProjects] = useState<ProjectListItem[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<"newest" | "displayOrder">("newest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectListItem | null>(null);

  const activeFilters = useMemo(() => {
    return {
      search: search.trim() || undefined,
      category: category || undefined,
      status: status || undefined,
      sort,
    };
  }, [search, category, status, sort]);

  const refreshProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const updated = await listAdminProjectsFn({
        data: {
          search: activeFilters.search,
          category: activeFilters.category as (typeof PROJECT_CATEGORIES)[number] | undefined,
          status: activeFilters.status as "draft" | "published" | undefined,
          sort: activeFilters.sort,
        },
      });
      setProjects(updated);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const onAction = async (projectId: string, action: () => Promise<unknown>) => {
    setPendingId(projectId);
    setError(null);

    try {
      await action();
      await refreshProjects();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Action failed.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <AdminShell
      current="projects"
      title="Projects"
      subtitle="Search, filter, and manage all project entries"
      sessionEmail={session?.email ?? "Admin"}
    >
      <section className="admin-card">
        <form
          className="admin-filter-row"
          onSubmit={(event) => {
            event.preventDefault();
            void refreshProjects();
          }}
        >
          <label>
            <span>Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects"
            />
          </label>

          <label>
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All</option>
              {PROJECT_CATEGORIES.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>

          <label>
            <span>Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as "newest" | "displayOrder")}
            >
              <option value="newest">Newest</option>
              <option value="displayOrder">Display Order</option>
            </select>
          </label>

          <button type="submit" className="admin-chip">
            <Search size={14} /> Apply
          </button>
        </form>

        {error ? <p className="admin-error-text">{error}</p> : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="admin-empty-cell">
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-empty-cell">
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      {project.mainImage ? (
                        <img src={project.mainImage} alt="Project" className="admin-list-thumb" />
                      ) : (
                        <div className="admin-list-thumb placeholder">No image</div>
                      )}
                    </td>
                    <td>
                      <div className="admin-list-title">{project.title}</div>
                      <div className="admin-list-slug">/{project.slug}</div>
                    </td>
                    <td>{project.category}</td>
                    <td>
                      <span className={`admin-status-pill ${project.status === "published" ? "published" : "draft"}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>{project.featured ? "Yes" : "No"}</td>
                    <td>{formatDate(project.updatedAt)}</td>
                    <td>
                      <div className="admin-row-actions">
                        <a href={`/projects/${project.id}/edit`} className="admin-chip">
                          <Edit3 size={13} /> Edit
                        </a>
                        <button
                          type="button"
                          className="admin-chip"
                          disabled={pendingId === project.id}
                          onClick={() =>
                            void onAction(project.id, () => duplicateProjectFn({ data: { id: project.id } }))
                          }
                        >
                          {pendingId === project.id ? <Loader2 size={13} className="spin" /> : <Copy size={13} />} Duplicate
                        </button>
                        <button
                          type="button"
                          className="admin-chip"
                          disabled={pendingId === project.id}
                          onClick={() =>
                            void onAction(project.id, () =>
                              setProjectStatusFn({
                                data: {
                                  id: project.id,
                                  status: project.status === "published" ? "draft" : "published",
                                },
                              }),
                            )
                          }
                        >
                          {project.status === "published" ? <EyeOff size={13} /> : <Eye size={13} />}
                          {project.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          className="admin-chip danger"
                          onClick={() => setDeleteTarget(project)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This project will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteTarget) return;
                void onAction(deleteTarget.id, () => deleteProjectFn({ data: { id: deleteTarget.id } }));
                setDeleteTarget(null);
              }}
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
