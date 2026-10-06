import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { MarketingShell } from "../components/marketing-shell";
import { listPublishedBlogPostsFn } from "../lib/cms/server-fns";
import type { BlogPost } from "../lib/cms/types";
import { BLOG_CATEGORIES } from "../lib/cms/types";

export const Route = createFileRoute("/$slug")({
  loader: async () => {
    try {
      const posts = await listPublishedBlogPostsFn({ data: { limit: 120 } });
      return { posts };
    } catch {
      return { posts: [] };
    }
  },
  component: BlogPage,
});

const CATEGORIES = ["All", ...BLOG_CATEGORIES] as const;

function formatDateStr(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso + "Z");
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function BlogPage() {
  const { posts: initialPosts } = Route.useLoaderData();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const result = await listPublishedBlogPostsFn({ data: { limit: 120 } });
        if (!cancelled) setPosts(result);
      } catch { /* ignore */ } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let res = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return res;
  }, [posts, activeCategory, search]);

  const featured = filtered.find((p) => p.featured) ?? filtered[0] ?? null;
  const grid = featured ? filtered.slice(1) : filtered;

  return (
    <MarketingShell
      eyebrow="BLOG"
      title="Ideas, insights, and practical thinking from HYRUX."
      description="Explore ideas on technology, product development, AI, data, and building digital products that solve real problems."
    >
      {/* Category Filter */}
      <div className="blog-filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`blog-chip ${activeCategory === cat ? "is-active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <div className="blog-search-wrap">
          <Search size={14} className="blog-search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search articlesâ€¦"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="blog-search-input"
          />
        </div>
      </div>

      {/* Featured Article */}
      {featured && !loading ? (
        <article className="blog-featured">
          <div className="blog-featured-image">
            {featured.coverImage ? (
              <img src={featured.coverImage} alt="" />
            ) : (
              <div className="blog-featured-placeholder">HYRUX</div>
            )}
          </div>
          <div className="blog-featured-content">
            <span className="blog-featured-badge">FEATURED</span>
            <span className="blog-category">{featured.category}</span>
            <a href={`/blog/${featured.slug}`} className="blog-featured-title">
              {featured.title}
            </a>
            <p className="blog-featured-excerpt">{featured.excerpt}</p>
            <div className="blog-meta">
              <span>{formatDateStr(featured.publishedAt)}</span>
              <span>Â·</span>
              <span>{featured.readingTime} min read</span>
            </div>
            <a href={`/blog/${featured.slug}`} className="blog-cta-link">
              Read Article <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </article>
      ) : null}

      {/* Article Grid */}
      <section>
        <h2 className="blog-section-heading">Latest Articles</h2>
        <div className="blog-grid">
          {loading && grid.length === 0 ? (
            <p className="blog-loading">Loading articlesâ€¦</p>
          ) : grid.length === 0 ? (
            <p className="blog-empty">No articles yet.</p>
          ) : (
            grid.map((post) => (
              <article key={post.id} className="blog-card">
                <a href={`/blog/${post.slug}`} className="blog-card-image">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt="" />
                  ) : (
                    <div className="blog-card-placeholder">{post.category}</div>
                  )}
                </a>
                <div className="blog-card-body">
                  <span className="blog-category">{post.category}</span>
                  <a href={`/blog/${post.slug}`} className="blog-card-title">
                    {post.title}
                  </a>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-meta">
                    <span>{formatDateStr(post.publishedAt)}</span>
                    <span>Â·</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                  <a href={`/blog/${post.slug}`} className="blog-cta-link">
                    Read Article <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </MarketingShell>
  );
}
