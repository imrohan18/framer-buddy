import { getDb } from "./db.server";
import type { CmsProject } from "./types";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  description: string;
  main_image: string | null;
  thumbnail_image: string | null;
  mobile_image: string | null;
  gallery_images: string;
  technologies: string;
  project_url: string | null;
  case_study_url: string | null;
  github_url: string | null;
  client_name: string | null;
  year: number | null;
  featured: number;
  status: "draft" | "published";
  display_order: number;
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

function mapProjectRow(row: ProjectRow): CmsProject {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category as CmsProject["category"],
    shortDescription: row.short_description,
    description: row.description,
    mainImage: row.main_image,
    thumbnailImage: row.thumbnail_image,
    mobileImage: row.mobile_image,
    galleryImages: safeParseStringArray(row.gallery_images),
    technologies: safeParseStringArray(row.technologies),
    projectUrl: row.project_url,
    caseStudyUrl: row.case_study_url,
    githubUrl: row.github_url,
    clientName: row.client_name,
    year: row.year,
    featured: row.featured === 1,
    status: row.status,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getProjectBySlug(slug: string) {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM projects WHERE slug = ? AND status = 'published' LIMIT 1")
    .get(slug) as ProjectRow | undefined;

  return row ? mapProjectRow(row) : null;
}

export function listPublishedProjects(limit = 20) {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT *
       FROM projects
       WHERE status = 'published'
       ORDER BY featured DESC, display_order ASC, updated_at DESC
       LIMIT ?`,
    )
    .all(Math.max(1, Math.min(limit, 120))) as Array<ProjectRow>;

  return rows.map(mapProjectRow);
}
