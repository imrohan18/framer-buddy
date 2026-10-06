import { getDb, newId, nowIso } from "./db.server";
import type { ProjectInput, ProjectListFilterInput } from "./schema";
import { removeProjectAsset, removeProjectAssets } from "./storage.server";
import { sanitizeText, slugify, toNullableString } from "./sanitize";
import type { CmsProject, ProjectListItem } from "./types";

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
    category: row.category,
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

function withTransaction<T>(work: () => T) {
  const db = getDb();
  db.exec("BEGIN");
  try {
    const result = work();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function normalizeDescription(value: string) {
  return value.replace(/\u0000/g, "").trim().slice(0, 25000);
}

function normalizeProjectInput(input: ProjectInput) {
  const baseSlug = slugify(input.slug || input.title);
  const title = sanitizeText(input.title, 140);
  const shortDescription = sanitizeText(input.shortDescription, 300);
  const description = normalizeDescription(input.description);

  const technologies = Array.from(
    new Set(input.technologies.map((tech) => sanitizeText(tech, 40)).filter(Boolean)),
  );

  return {
    title,
    slug: baseSlug,
    category: input.category,
    shortDescription,
    description,
    mainImage: input.mainImage ?? null,
    thumbnailImage: input.thumbnailImage ?? null,
    mobileImage: input.mobileImage ?? null,
    galleryImages: input.galleryImages,
    technologies,
    projectUrl: toNullableString(input.projectUrl),
    caseStudyUrl: toNullableString(input.caseStudyUrl),
    githubUrl: toNullableString(input.githubUrl),
    clientName: toNullableString(input.clientName),
    year: input.year ?? null,
    featured: input.featured,
    status: input.status,
    displayOrder: input.displayOrder,
  };
}

function slugExists(slug: string, excludeId?: string) {
  const db = getDb();
  if (excludeId) {
    const row = db
      .prepare("SELECT id FROM projects WHERE slug = ? AND id != ? LIMIT 1")
      .get(slug, excludeId) as { id: string } | undefined;
    return Boolean(row);
  }

  const row = db.prepare("SELECT id FROM projects WHERE slug = ? LIMIT 1").get(slug) as
    | { id: string }
    | undefined;
  return Boolean(row);
}

function makeUniqueSlug(baseSlug: string, excludeId?: string) {
  const safeBase = baseSlug || "project";
  if (!slugExists(safeBase, excludeId)) return safeBase;

  let i = 2;
  while (slugExists(`${safeBase}-${i}`, excludeId)) {
    i += 1;
  }

  return `${safeBase}-${i}`;
}

function clearPreviousFeaturedProject(exceptId?: string) {
  const db = getDb();
  if (exceptId) {
    db.prepare("UPDATE projects SET featured = 0 WHERE id != ? AND featured = 1").run(exceptId);
    return;
  }
  db.prepare("UPDATE projects SET featured = 0 WHERE featured = 1").run();
}

export function getProjectById(id: string) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM projects WHERE id = ? LIMIT 1").get(id) as
    | ProjectRow
    | undefined;

  return row ? mapProjectRow(row) : null;
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

export function listProjectsForAdmin(filters: ProjectListFilterInput) {
  const db = getDb();
  const where: string[] = [];
  const params: Array<string> = [];

  if (filters.search) {
    where.push("(title LIKE ? OR short_description LIKE ? OR technologies LIKE ?)");
    const token = `%${filters.search}%`;
    params.push(token, token, token);
  }

  if (filters.category) {
    where.push("category = ?");
    params.push(filters.category);
  }

  if (filters.status) {
    where.push("status = ?");
    params.push(filters.status);
  }

  const orderBy =
    filters.sort === "displayOrder"
      ? "ORDER BY display_order ASC, updated_at DESC"
      : "ORDER BY updated_at DESC";

  const query = `
    SELECT id, title, slug, category, status, featured, display_order, updated_at, main_image
    FROM projects
    ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
    ${orderBy}
    LIMIT 250
  `;

  const rows = db.prepare(query).all(...params) as Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    status: "draft" | "published";
    featured: number;
    display_order: number;
    updated_at: string;
    main_image: string | null;
  }>;

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    status: row.status,
    featured: row.featured === 1,
    displayOrder: row.display_order,
    updatedAt: row.updated_at,
    mainImage: row.main_image,
  })) satisfies Array<ProjectListItem>;
}

export function getDashboardOverview() {
  const db = getDb();

  const totals = db
    .prepare(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
         SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS drafts,
         SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) AS featured
       FROM projects`,
    )
    .get() as {
    total: number;
    published: number;
    drafts: number;
    featured: number;
  };

  const recent = db
    .prepare(
      `SELECT id, title, status, updated_at
       FROM projects
       ORDER BY updated_at DESC
       LIMIT 6`,
    )
    .all() as Array<{ id: string; title: string; status: "draft" | "published"; updated_at: string }>;

  return {
    totals: {
      totalProjects: Number(totals.total ?? 0),
      published: Number(totals.published ?? 0),
      drafts: Number(totals.drafts ?? 0),
      featured: Number(totals.featured ?? 0),
    },
    recentProjects: recent.map((project) => ({
      id: project.id,
      title: project.title,
      status: project.status,
      updatedAt: project.updated_at,
    })),
  };
}

export function createProject(input: ProjectInput) {
  const data = normalizeProjectInput(input);
  const createdAt = nowIso();
  const updatedAt = createdAt;
  const id = newId();
  const slug = makeUniqueSlug(data.slug);

  withTransaction(() => {
    const db = getDb();

    if (data.featured) {
      clearPreviousFeaturedProject();
    }

    db.prepare(
      `INSERT INTO projects (
        id, title, slug, category, short_description, description, main_image, thumbnail_image,
        mobile_image, gallery_images, technologies, project_url, case_study_url, github_url,
        client_name, year, featured, status, display_order, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
    ).run(
      id,
      data.title,
      slug,
      data.category,
      data.shortDescription,
      data.description,
      data.mainImage,
      data.thumbnailImage,
      data.mobileImage,
      JSON.stringify(data.galleryImages),
      JSON.stringify(data.technologies),
      data.projectUrl,
      data.caseStudyUrl,
      data.githubUrl,
      data.clientName,
      data.year,
      data.featured ? 1 : 0,
      data.status,
      data.displayOrder,
      createdAt,
      updatedAt,
    );
  });

  const created = getProjectById(id);
  if (!created) {
    throw new Error("Failed to create project.");
  }

  return created;
}

export function updateProject(id: string, input: ProjectInput) {
  const existing = getProjectById(id);
  if (!existing) {
    throw new Error("Project not found.");
  }

  const data = normalizeProjectInput(input);
  const updatedAt = nowIso();
  const slug = makeUniqueSlug(data.slug, id);

  withTransaction(() => {
    const db = getDb();

    if (data.featured) {
      clearPreviousFeaturedProject(id);
    }

    db.prepare(
      `UPDATE projects
       SET title = ?, slug = ?, category = ?, short_description = ?, description = ?,
           main_image = ?, thumbnail_image = ?, mobile_image = ?, gallery_images = ?, technologies = ?,
           project_url = ?, case_study_url = ?, github_url = ?, client_name = ?, year = ?,
           featured = ?, status = ?, display_order = ?, updated_at = ?
       WHERE id = ?`,
    ).run(
      data.title,
      slug,
      data.category,
      data.shortDescription,
      data.description,
      data.mainImage,
      data.thumbnailImage,
      data.mobileImage,
      JSON.stringify(data.galleryImages),
      JSON.stringify(data.technologies),
      data.projectUrl,
      data.caseStudyUrl,
      data.githubUrl,
      data.clientName,
      data.year,
      data.featured ? 1 : 0,
      data.status,
      data.displayOrder,
      updatedAt,
      id,
    );
  });

  const removedAssets = [
    existing.mainImage,
    existing.thumbnailImage,
    existing.mobileImage,
    ...existing.galleryImages,
  ].filter((asset) => {
    if (!asset) return false;
    const isStillUsed =
      data.mainImage === asset ||
      data.thumbnailImage === asset ||
      data.mobileImage === asset ||
      data.galleryImages.includes(asset);
    return !isStillUsed;
  });

  removeProjectAssets(removedAssets);

  const updated = getProjectById(id);
  if (!updated) {
    throw new Error("Failed to update project.");
  }

  return updated;
}

export function duplicateProject(id: string) {
  const source = getProjectById(id);
  if (!source) {
    throw new Error("Project not found.");
  }

  const duplicatedInput: ProjectInput = {
    title: `${source.title} Copy`,
    slug: slugify(`${source.slug}-copy`),
    category: source.category as ProjectInput["category"],
    shortDescription: source.shortDescription,
    description: source.description,
    mainImage: source.mainImage,
    thumbnailImage: source.thumbnailImage,
    mobileImage: source.mobileImage,
    galleryImages: source.galleryImages,
    technologies: source.technologies,
    projectUrl: source.projectUrl || "",
    caseStudyUrl: source.caseStudyUrl || "",
    githubUrl: source.githubUrl || "",
    clientName: source.clientName || "",
    year: source.year,
    featured: false,
    status: "draft",
    displayOrder: source.displayOrder,
  };

  return createProject(duplicatedInput);
}

export function deleteProject(id: string) {
  const existing = getProjectById(id);
  if (!existing) {
    throw new Error("Project not found.");
  }

  const db = getDb();
  db.prepare("DELETE FROM projects WHERE id = ?").run(id);

  removeProjectAssets([
    existing.mainImage,
    existing.thumbnailImage,
    existing.mobileImage,
    ...existing.galleryImages,
  ]);

  return { ok: true };
}

export function setProjectStatus(id: string, status: "draft" | "published") {
  const db = getDb();
  db.prepare("UPDATE projects SET status = ?, updated_at = ? WHERE id = ?").run(status, nowIso(), id);

  const updated = getProjectById(id);
  if (!updated) {
    throw new Error("Project not found.");
  }

  return updated;
}

export function removeSingleProjectImage(id: string, imagePath: string, imageKind: string) {
  const project = getProjectById(id);
  if (!project) {
    throw new Error("Project not found.");
  }

  const payload: ProjectInput = {
    title: project.title,
    slug: project.slug,
    category: project.category as ProjectInput["category"],
    shortDescription: project.shortDescription,
    description: project.description,
    mainImage: project.mainImage,
    thumbnailImage: project.thumbnailImage,
    mobileImage: project.mobileImage,
    galleryImages: project.galleryImages,
    technologies: project.technologies,
    projectUrl: project.projectUrl || "",
    caseStudyUrl: project.caseStudyUrl || "",
    githubUrl: project.githubUrl || "",
    clientName: project.clientName || "",
    year: project.year,
    featured: project.featured,
    status: project.status,
    displayOrder: project.displayOrder,
  };

  if (imageKind === "main") payload.mainImage = null;
  if (imageKind === "thumbnail") payload.thumbnailImage = null;
  if (imageKind === "mobile") payload.mobileImage = null;
  if (imageKind === "gallery") {
    payload.galleryImages = payload.galleryImages.filter((path) => path !== imagePath);
  }

  const updated = updateProject(id, payload);
  removeProjectAsset(imagePath);
  return updated;
}
