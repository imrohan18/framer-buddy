import { getDb, newId, nowIso } from "./db.server";
import type { BlogPostFilterInput } from "./schema";
import { sanitizeText, slugify, toNullableString } from "./sanitize";
import type { BlogCategory, BlogPost, BlogStatus, BlogListItem } from "./types";

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
  status: BlogStatus;
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

/* ============================================================
   ADMIN — full CRUD
   ============================================================ */

export function listBlogPosts(filter: BlogPostFilterInput) {
  const db = getDb();
  let query = "SELECT * FROM blog_posts WHERE 1=1";
  const params: Array<string | number> = [];

  if (filter.search) {
    query += " AND (title LIKE ? OR excerpt LIKE ?)";
    const s = `%${filter.search}%`;
    params.push(s, s);
  }
  if (filter.category) {
    query += " AND category = ?";
    params.push(filter.category);
  }
  if (filter.status) {
    query += " AND status = ?";
    params.push(filter.status);
  }
  query += filter.sort === "oldest" ? " ORDER BY created_at ASC" : " ORDER BY created_at DESC";

  const rows = db.prepare(query).all(...params) as Array<BlogRow>;
  return rows.map(mapBlogRow);
}

export function getBlogPostById(id: string): BlogPost | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM blog_posts WHERE id = ? LIMIT 1").get(id) as BlogRow | undefined;
  return row ? mapBlogRow(row) : null;
}

export function getBlogPostBySlug(slug: string, status?: BlogStatus): BlogPost | null {
  const db = getDb();
  const row = status
    ? db.prepare("SELECT * FROM blog_posts WHERE slug = ? AND status = ? LIMIT 1").get(slug, status) as BlogRow | undefined
    : db.prepare("SELECT * FROM blog_posts WHERE slug = ? LIMIT 1").get(slug) as BlogRow | undefined;
  return row ? mapBlogRow(row) : null;
}

export function createBlogPost(input: {
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  author: string;
  readingTime: number;
  featured: boolean;
  status: BlogStatus;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
}): BlogPost {
  // Ensure only one featured post at a time
  if (input.featured) {
    clearFeaturedFlag();
  }

  const id = newId();
  const timestamp = nowIso();
  const publishedAt = input.publishedAt ?? (input.status === "published" ? timestamp : null);
  const db = getDb();

  db.prepare(
    `INSERT INTO blog_posts
       (id, title, slug, excerpt, content, cover_image, category, tags, author, reading_time, featured, status, published_at, seo_title, seo_description, og_image, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    sanitizeText(input.title, 240),
    input.slug || slugify(input.title),
    sanitizeText(input.excerpt, 400),
    input.content,
    input.coverImage,
    input.category,
    JSON.stringify(input.tags),
    sanitizeText(input.author, 120),
    input.readingTime,
    input.featured ? 1 : 0,
    input.status,
    publishedAt,
    input.seoTitle ? sanitizeText(input.seoTitle, 120) : null,
    input.seoDescription ? sanitizeText(input.seoDescription, 300) : null,
    input.ogImage,
    timestamp,
    timestamp,
  );

  return getBlogPostById(id) as BlogPost;
}

export function updateBlogPost(id: string, input: NonNullable<ReturnType<typeof getBlogPostById>>) {
  const db = getDb();
  if (input.featured) {
    clearFeaturedFlag(id);
  }

  const existing = dbRow(id);
  const publishedAt = input.publishedAt ??
    (input.status === "published" && !existing.published_at ? nowIso() : existing.published_at);

  db.prepare(
    `UPDATE blog_posts SET
      title=?, slug=?, excerpt=?, content=?, cover_image=?, category=?, tags=?, author=?,
      reading_time=?, featured=?, status=?, published_at=?, seo_title=?, seo_description=?,
      og_image=?, updated_at=?
    WHERE id=?`,
  ).run(
    sanitizeText(input.title, 240),
    input.slug,
    sanitizeText(input.excerpt, 400),
    input.content,
    input.coverImage,
    input.category,
    JSON.stringify(input.tags),
    sanitizeText(input.author, 120),
    input.readingTime,
    input.featured ? 1 : 0,
    input.status,
    publishedAt,
    input.seoTitle ? sanitizeText(input.seoTitle, 120) : null,
    input.seoDescription ? sanitizeText(input.seoDescription, 300) : null,
    input.ogImage,
    nowIso(),
    id,
  );

  return getBlogPostById(id) as BlogPost;
}

function clearFeaturedFlag(excludeId?: string) {
  const db = getDb();
  if (excludeId) {
    db.prepare("UPDATE blog_posts SET featured = 0 WHERE featured = 1 AND id != ?").run(excludeId);
  } else {
    db.exec("UPDATE blog_posts SET featured = 0 WHERE featured = 1");
  }
}

export function deleteBlogPost(id: string) {
  const db = getDb();
  db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id);
  return { id };
}

/** Internal helpers used by create/update. */

function dbRow(id: string) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM blog_posts WHERE id = ? LIMIT 1").get(id) as BlogRow | undefined;
  if (!row) throw new Error("Blog post not found.");
  return row;
}
