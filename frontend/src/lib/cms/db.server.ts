import { randomUUID } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

function getDatabasePath(): string {
  // In serverless runtimes (like Vercel Lambda), the root filesystem is read-only.
  // /tmp is the only writable directory.
  if (process.env["VERCEL"] || process.env["AWS_LAMBDA_FUNCTION_NAME"]) {
    const tmpDbPath = join("/tmp", "cyrux.sqlite");
    if (!existsSync(tmpDbPath)) {
      const candidates = [
        join(process.cwd(), "data", "cyrux.sqlite"),
        join(process.cwd(), "..", "data", "cyrux.sqlite"),
      ];
      let copied = false;
      for (const candidate of candidates) {
        if (existsSync(candidate)) {
          try {
            copyFileSync(candidate, tmpDbPath);
            copied = true;
            break;
          } catch (e) {
            console.error("Failed to copy seed sqlite db from", candidate, e);
          }
        }
      }
      if (!copied) {
        try {
          mkdirSync(dirname(tmpDbPath), { recursive: true });
        } catch {
          // ignore if /tmp already exists
        }
      }
    }
    return tmpDbPath;
  }

  // Local development: prioritize frontend/data, then ../data
  const frontendData = join(process.cwd(), "data", "cyrux.sqlite");
  if (existsSync(frontendData)) {
    return frontendData;
  }
  const rootData = join(process.cwd(), "..", "data", "cyrux.sqlite");
  mkdirSync(dirname(rootData), { recursive: true });
  return rootData;
}

const dbPath = getDatabasePath();

const database = new DatabaseSync(dbPath, {
  enableForeignKeyConstraints: true,
});

// Keep schema creation centralized so routes and server functions share one DB lifecycle.
initializeSchema();

export function getDb() {
  return database;
}

export function nowIso() {
  return new Date().toISOString();
}

export function newId() {
  return randomUUID();
}

function initializeSchema() {
  database.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      main_image TEXT,
      thumbnail_image TEXT,
      mobile_image TEXT,
      gallery_images TEXT NOT NULL DEFAULT '[]',
      technologies TEXT NOT NULL DEFAULT '[]',
      project_url TEXT,
      case_study_url TEXT,
      github_url TEXT,
      client_name TEXT,
      year INTEGER,
      featured INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
      display_order INTEGER NOT NULL DEFAULT 100,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order ASC);
    CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured DESC);

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      token_hash TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at ASC);

    CREATE UNIQUE INDEX IF NOT EXISTS uq_one_featured_project ON projects(featured)
    WHERE featured = 1;

    CREATE TABLE IF NOT EXISTS pricing_packages (
      id TEXT PRIMARY KEY,
      badge TEXT,
      title TEXT NOT NULL,
      price TEXT NOT NULL,
      price_label TEXT,
      description TEXT NOT NULL,
      features TEXT NOT NULL DEFAULT '[]',
      cta_text TEXT NOT NULL,
      cta_type TEXT NOT NULL CHECK (cta_type IN ('pdf', 'details', 'inquiry')) DEFAULT 'inquiry',
      pdf_url TEXT,
      details_url TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      featured INTEGER NOT NULL DEFAULT 0,
      display_order INTEGER NOT NULL DEFAULT 100,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS project_inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      project_description TEXT NOT NULL,
      project_type TEXT,
      budget_range TEXT,
      message TEXT,
      status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'closed')) DEFAULT 'new',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_project_inquiries_status ON project_inquiries(status);
    CREATE INDEX IF NOT EXISTS idx_project_inquiries_created_at ON project_inquiries(created_at DESC);

    -- ============================================================
    -- BLOG POSTS
    -- ============================================================

    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      cover_image TEXT,
      category TEXT NOT NULL DEFAULT 'Technology',
      tags TEXT NOT NULL DEFAULT '[]',
      author TEXT NOT NULL DEFAULT 'HYRUX Team',
      reading_time INTEGER NOT NULL DEFAULT 5,
      featured INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
      published_at TEXT,
      seo_title TEXT,
      seo_description TEXT,
      og_image TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured DESC);

    CREATE UNIQUE INDEX IF NOT EXISTS uq_one_featured_post ON blog_posts(featured)
    WHERE featured = 1;
  `);

  seedBlogPosts();
  seedPricingPackages();
}

/* ============================================================
   SEED — a default featured article so the /blog page is never empty.
   Replace this with real content from the admin panel later.
   ============================================================ */

function seedBlogPosts() {
  const timestamp = nowIso();
  const insert = database.prepare(
    `INSERT OR IGNORE INTO blog_posts
       (id, title, slug, excerpt, content, cover_image, category, tags, author, reading_time, featured, status, published_at, seo_title, seo_description, og_image, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, JSON_ARRAY(?), ?, ?, ?, ?, ?, ?, ?, null, ?, ?)`,
  );

  insert.run(
    "seed-ai-tech",
    "How AI Is Changing the Way Businesses Build Software",
    "how-ai-is-changing-business",
    "Practical insights into where AI creates real value and where businesses should be more thoughtful about using it.",
    "<p>Artificial intelligence is no longer a future technology — it is reshaping how companies prototype, develop, and ship software today.</p>\n\n<h2>The Shift in Development Workflows</h2>\n<p>From code generation to automated testing, AI tools are reducing the time between idea and working prototype. But the real opportunity lies not in replacing engineers, but in amplifying their judgment.</p>\n\n<p>Teams that treat AI as a co-pilot rather than an autopilot consistently deliver better outcomes. The key is choosing where automation adds leverage without sacrificing product quality.</p>\n\n<h2>Where AI Adds Real Value</h2>\n<ul>\n<li><strong>Rapid prototyping</strong> — generating scaffolding and boilerplate so teams can validate concepts in hours instead of weeks.</li>\n<li><strong>Code review augmentation</strong> — catching patterns, suggesting improvements, and flagging security concerns early.</li>\n<li><strong>Documentation and knowledge transfer</strong> — turning complex systems into accessible explanations for stakeholders.</li>\n</ul>\n\n<h2>Thinking Thoughtfully About AI</h2>\n<p>Not every problem needs AI. Many business challenges are solved faster with clear requirements, good architecture, and iterative delivery. The best approach is pragmatic: use AI where it removes friction, and invest human expertise where it matters most.</p>",
    "/uploads/projects/gallery/blog-hero-ai.jpg",
    "Technology",
    "AI",
    "HYRUX Team",
    7,
    1,
    "published",
    "2026-10-06T12:00:00Z",
    "How AI Is Changing Business Software | HYRUX Blog",
    "Exploring practical applications of AI in software engineering and business strategy.",
    timestamp,
    timestamp,
  );
}

function seedPricingPackages() {
  const timestamp = nowIso();
  const insert = database.prepare(
    `INSERT OR IGNORE INTO pricing_packages
       (id, badge, title, price, price_label, description, features, cta_text, cta_type, pdf_url, details_url, active, featured, display_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)`,
  );

  insert.run(
    "starting-package",
    "STARTING PACKAGE",
    "Software / Full-Stack Project",
    "₹4,999",
    "Starting at",
    "A ready-to-start development package for businesses, students, startups, and individuals who need a complete digital project.",
    JSON.stringify([
      "Software projects",
      "Full-stack development",
      "Project delivery",
      "Clear project scope",
      "Details and deliverables provided",
    ]),
    "View What's Included",
    "details",
    null,
    null,
    1,
    10,
    timestamp,
    timestamp,
  );

  insert.run(
    "custom-project",
    "FOR UNIQUE REQUIREMENTS",
    "Custom Project",
    "Custom",
    null,
    "Have a bigger idea or specific requirements? Tell us what you're building and we'll discuss the right solution for you.",
    JSON.stringify([
      "Custom software",
      "Business websites",
      "Full-stack applications",
      "SaaS platforms",
      "AI / ML solutions",
      "Data & analytics",
      "Business automation",
    ]),
    "Discuss Your Project",
    "inquiry",
    null,
    null,
    0,
    20,
    timestamp,
    timestamp,
  );
}
