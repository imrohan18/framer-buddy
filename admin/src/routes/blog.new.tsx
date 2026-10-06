import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Save, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "../components/admin-shell";
import { requireAdminRoute } from "../lib/cms/admin-guard";
import { getAdminSessionFn, createBlogPostFn, listBlogPostsFn } from "../lib/cms/server-fns";
import type { BlogListItem, BlogCategory } from "../lib/cms/types";
import { BLOG_CATEGORIES } from "../lib/cms/types";
import { formatDate } from "../lib/utils";

type FormState = {
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string;
  author: string;
  readingTime: string;
  featured: boolean;
  status: "draft" | "published";
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string | null;
};

const EMPTY: FormState = {
  title: "", slug: "", category: "Technology", excerpt: "", content: "",
  coverImage: null, tags: "", author: "HYRUX Team", readingTime: "5",
  featured: false, status: "draft", publishedAt: "",
  seoTitle: "", seoDescription: "", ogImage: null,
};

export const Route = createFileRoute("/blog/new")({
  beforeLoad: requireAdminRoute,
  loader: async () => {
    const session = await getAdminSessionFn();
    return { session };
  },
  component: BlogFormPage,
});

function BlogFormPage() {
  const { session } = Route.useLoaderData();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ t: "success" | "error"; text: string } | null>(null);

  // Read-only slug preview
  const slugPreview = useMemo(() => form.slug || (form.title ? form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : ""), [form.title, form.slug]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => setForm((p) => ({ ...p, [key]: val }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setMsg({ t: "error", text: "Title, excerpt and content are required." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const slugClean = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      await createBlogPostFn({
        data: {
          title: form.title.trim(),
          slug: form.slug || slugClean,
          category: form.category,
          excerpt: form.excerpt.trim(),
          content: form.content.trim(),
          coverImage: form.coverImage || undefined,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          author: form.author.trim() || "HYRUX Team",
          readingTime: parseInt(form.readingTime, 10) || 5,
          featured: form.featured,
          status: form.status,
          publishedAt: form.publishedAt || undefined,
          seoTitle: form.seoTitle.trim() || undefined,
          seoDescription: form.seoDescription.trim() || undefined,
          ogImage: form.ogImage || undefined,
        },
      });
      setForm(EMPTY);
      setMsg({ t: "success", text: "Article saved successfully!" });
    } catch (err) {
      setMsg({ t: "error", text: `Could not save: ${err instanceof Error ? err.message : "Unknown"}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      current="blog"
      title="New Article"
      subtitle="Create a blog article for the public site"
      sessionEmail={session?.email ?? "Admin"}
    >
      <section className="admin-card">
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <Link to="/blog" className="admin-chip"><ArrowLeft size={14} /> Back to Articles</Link>
          </div>

        <form className="admin-form" onSubmit={onSubmit}>
          <div className="admin-form-grid two-col">
            <label>
              <span>Title *</span>
              <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)} maxLength={240} />
            </label>
            <label>
              <span>Slug *</span>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="text" required value={slugPreview} readOnly style={{ flex: 1, background: "#f8f6f3", color: "rgba(13,13,13,0.5)" }} />
                <button type="button" onClick={() => set("slug", slugPreview)} className="admin-primary-btn" style={{ fontSize: "0.75rem", padding: "8px 14px" }}>Use as Slug</button>
              </div>
            </label>
            <label>
              <span>Category *</span>
              <select value={form.category} onChange={(e) => set("category", e.target.value as BlogCategory)}>
                {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label>
              <span>Author</span>
              <input type="text" value={form.author} onChange={(e) => set("author", e.target.value)} maxLength={120} />
            </label>
          </div>

          <label className="admin-field-stack">
            <span>Excerpt *</span>
            <textarea required rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} maxLength={400} />
          </label>

          <label className="admin-field-stack">
            <span>Content *</span>
            <textarea required rows={14} value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Write your article in clean HTML format…" />
          </label>

          <div className="admin-form-grid two-col">
            <label>
              <span>Reading Time (minutes)</span>
              <input type="number" min={1} max={120} value={form.readingTime} onChange={(e) => set("readingTime", e.target.value)} />
            </label>
            <label>
              <span>Cover Image Path</span>
              <input type="text" value={form.coverImage || ""} onChange={(e) => set("coverImage", e.target.value || null)} placeholder="/uploads/projects/gallery/blog-cover.jpg" />
            </label>
            <label>
              <span>OG Image Path</span>
              <input type="text" value={form.ogImage || ""} onChange={(e) => set("ogImage", e.target.value || null)} placeholder="/uploads/projects/gallery/blog-og.jpg" />
            </label>
            <label>
              <span>Status</span>
              <select value={form.status} onChange={(e) => set("status", e.target.value as "draft" | "published")}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label>
              <span>Tags (comma-separated)</span>
              <input type="text" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="AI, Engineering, Business" />
            </label>
            <label>
              <span>Publish Date (ISO 8601)</span>
              <input type="text" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} placeholder="2026-10-06T12:00:00Z" />
            </label>
          </div>

          <div className="admin-form-grid two-col">
            <label>
              <span>SEO Title</span>
              <input type="text" value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} maxLength={120} placeholder="Leave empty to auto-generate from title" />
            </label>
            <label>
              <span>SEO Description</span>
              <textarea rows={2} value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} maxLength={300} />
            </label>
            <label className="admin-checkbox-row">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
              <span>Mark as Featured Article</span>
            </label>
          </div>

          {msg ? (
            <p className={`admin-form-message ${msg.t === "success" ? "is-success" : "is-error"}`}>{msg.text}</p>
          ) : null}

          <div className="admin-form-actions">
            <button type="submit" className="admin-primary-btn" disabled={saving}>
              {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
              <span>{saving ? "Saving…" : "Save Article"}</span>
            </button>
          </div>
        </form>
      </section>
    </AdminShell>
  );
}
