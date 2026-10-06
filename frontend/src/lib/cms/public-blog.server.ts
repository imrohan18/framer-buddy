import { getDb } from "./db.server";
import type { BlogCategory, BlogPost } from "./types";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string;
  author: string;
  reading_time: number;
  featured: number;
  status: "draft" | "published";
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
};

function safeParseStringArray(input: string) {
  try {
    const parsed = JSON.parse(input) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function mapBlogRow(row: BlogRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    category: row.category as BlogCategory,
    tags: safeParseStringArray(row.tags),
    author: row.author,
    readingTime: row.reading_time,
    featured: row.featured === 1,
    status: row.status,
    publishedAt: row.published_at,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    ogImage: row.og_image,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** List published blog posts ordered newest-first. */
export function listPublishedBlogPosts(limit = 24) {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC LIMIT ?`,
    )
    .all(Math.max(1, Math.min(limit, 120))) as Array<BlogRow>;
  return rows.map(mapBlogRow);
}

/** Get a single published post by slug. */
export function getPublishedBlogPostBySlug(slug: string): BlogPost | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1")
    .get(slug) as BlogRow | undefined;
  return row ? mapBlogRow(row) : null;
}

/** Get the most recent published post (used as featured fallback). */
export function getLatestPublishedBlogPost(): BlogPost | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 1")
    .get() as BlogRow | undefined;
  return row ? mapBlogRow(row) : null;
}
