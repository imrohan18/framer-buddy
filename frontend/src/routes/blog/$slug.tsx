import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Share2, Linkedin, Twitter } from "lucide-react";

import { getPublishedBlogPostBySlugFn } from "../../lib/cms/server-fns";
import type { BlogPost } from "../../lib/cms/types";
import { formatDate } from "../../lib/utils";
import { MarketingShell } from "../../components/marketing-shell";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    try {
      const post = await getPublishedBlogPostBySlugFn({ data: { slug: params.slug } });
      return { post };
    } catch (err) {
      console.error("[blog.$slug] loader error:", err);
      return { post: null };
    }
  },
  errorComponent: BlogNotFound,
  component: BlogDetailPage,
});

function BlogNotFound() {
  return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 10 }}>Article not found</h2>
      <p style={{ color: "rgba(13,13,13,0.55)", marginBottom: 20 }}>The article you're looking for doesn't exist or has been removed.</p>
      <Link to="/blog" className="admin-primary-btn" style={{ display: "inline-flex" }}>
        <ArrowLeft size={16} /> Back to Blog
      </Link>
    </div>
  );
}

function BlogDetailPage() {
  const { post } = Route.useLoaderData();
  if (!post) throw new Error("Not found");

  const shareUrl = typeof window !== "undefined" ? `https://hyrux.in/blog/${post.slug}` : "";

  return (
    <MarketingShell eyebrow={post.category} title={post.title} description={post.excerpt}>
      <article className="blog-detail">
        <header className="blog-detail-header">
          <div className="blog-detail-meta">
            <span className="blog-category">{post.category}</span>
            <div className="blog-detail-dates">
              <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
              <span>·</span>
              <span className="blog-detail-author">{post.author}</span>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className="blog-detail-cover" />
          )}
        </header>

        {/* Content */}
        <div
          className="blog-detail-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {(post.tags as string[]).length > 0 ? (
          <div className="blog-detail-tags">
            {(post.tags as string[]).map((tag: string) => (
              <span key={tag} className="blog-tag">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {/* Share */}
        <div className="blog-detail-share">
          <span>Share this article</span>
          <div className="blog-share-actions">
            <button
              type="button"
              className="blog-share-btn"
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`, "_blank")}
            >
              <Twitter size={16} />
            </button>
            <button
              type="button"
              className="blog-share-btn"
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")}
            >
              <Linkedin size={16} />
            </button>
            <button
              type="button"
              className="blog-share-btn"
              onClick={() => { if (navigator.share) navigator.share({ title: post.title, url: shareUrl }); }}
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* CTA Band */}
        <section className="blog-detail-cta">
          <div className="blog-detail-cta-inner">
            <h3>Have an idea worth building?</h3>
            <p>Let's build it with HYRUX.</p>
            <Link to="/contact" className="admin-primary-btn" style={{ marginTop: 12, display: "inline-flex" }}>
              Start a Project <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </article>
    </MarketingShell>
  );
}
