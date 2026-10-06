import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "../components/admin-shell";
import { requireAdminRoute } from "../lib/cms/admin-guard";
import {
  deleteBlogPostFn,
  getAdminSessionFn,
  listBlogPostsFn,
} from "../lib/cms/server-fns";
import type { BlogListItem } from "../lib/cms/types";
import { formatDate } from "../lib/utils";

export const Route = createFileRoute("/blog")({
  beforeLoad: requireAdminRoute,
  loader: async () => {
    const [session, posts] = await Promise.all([getAdminSessionFn(), listBlogPostsFn({ data: {} })]);
    return { session, posts };
  },
  component: AdminBlogPage,
});

const STATUS_LABELS: Record<string, string> = { draft: "Draft", published: "Published" };

function AdminBlogPage() {
  const { session, posts: initialPosts } = Route.useLoaderData();
  const [posts, setPosts] = useState<BlogListItem[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = posts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    }
    if (category) result = result.filter((p) => p.category === category);
    if (statusFilter) result = result.filter((p) => p.status === statusFilter);
    return result;
  }, [posts, search, category, statusFilter]);

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this blog post? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await deleteBlogPostFn({ data: { id } });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setBusyId(null);
    }
  };

  // Refresh when search/filter changes
  useEffect(() => {
    void listBlogPostsFn({ data: { search, category: category || undefined, status: statusFilter || undefined } as any }).then((updated) => {
      setPosts(updated);
    });
  }, [search, category, statusFilter]);

  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <AdminShell
      current="blog"
      title="Blog"
      subtitle="Manage articles for the public blog section"
      sessionEmail={session?.email ?? "Admin"}
    >
      <section className="admin-card">
        <div className="admin-card-header">
          <h2>All Articles</h2>
          <span className="admin-count-badge">{filtered.length} of {posts.length}</span>
        </div>

        <div className="admin-filter-row">
          <label>
            <span>Search</span>
            <input type="text" placeholder="Title or excerpt…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <label>
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <button type="button" onClick={() => { setSearch(""); setCategory(""); setStatusFilter(""); }} className="admin-primary-btn" style={{ fontSize: "0.78rem", padding: "10px 16px" }}>Reset</button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Published</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="admin-empty-cell">No articles found. Create your first article →</td></tr>
              ) : (
                filtered.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className="admin-list-title">{post.title}</div>
                      <div className="admin-list-slug">{post.slug}</div>
                    </td>
                    <td>{post.category}</td>
                    <td>{post.author}</td>
                    <td>{post.featured ? <span className="admin-status-pill published">Yes</span> : "—"}</td>
                    <td><span className={`admin-status-pill ${post.status === "published" ? "published" : "draft"}`}>{STATUS_LABELS[post.status]}</span></td>
                    <td>{post.publishedAt ? formatDate(post.publishedAt) : "—"}</td>
                    <td>{formatDate(post.updatedAt)}</td>
                    <td>
                      <div className="admin-row-actions">
                        <Link to="/blog/new" className="admin-chip"><Pencil size={13} /> Edit</Link>
                        {post.status === "published" ? (
                          <button className="admin-chip" disabled={!!busyId && busyId === post.id} onClick={() => {}}>Unpublish</button>
                        ) : (
                          <button className="admin-chip" disabled={!!busyId && busyId === post.id} onClick={() => {}}>Publish</button>
                        )}
                        <button className="admin-chip danger" disabled={!!busyId && busyId === post.id} onClick={() => onDelete(post.id)}>
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
    </AdminShell>
  );
}
