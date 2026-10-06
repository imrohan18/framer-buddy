import { getDb, newId, nowIso } from "./db.server";
import type {
  InquiryStatus,
  PricingCtaType,
  PricingPackage,
  ProjectInquiry,
  ProjectInquiryInput,
} from "./types";

type PackageRow = {
  id: string;
  badge: string | null;
  title: string;
  price: string;
  price_label: string | null;
  description: string;
  features: string;
  cta_text: string;
  cta_type: PricingCtaType;
  pdf_url: string | null;
  details_url: string | null;
  active: number;
  featured: number;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type InquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_description: string;
  project_type: string | null;
  budget_range: string | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
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

function cleanText(value: string, maxLength: number) {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanMultiline(value: string, maxLength: number) {
  return value.replace(/\u0000/g, "").trim().slice(0, maxLength);
}

function toNullable(value: string | undefined, maxLength: number) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function mapPackageRow(row: PackageRow): PricingPackage {
  return {
    id: row.id,
    badge: row.badge,
    title: row.title,
    price: row.price,
    priceLabel: row.price_label,
    description: row.description,
    features: safeParseStringArray(row.features),
    ctaText: row.cta_text,
    ctaType: row.cta_type,
    pdfUrl: row.pdf_url,
    detailsUrl: row.details_url,
    active: row.active === 1,
    featured: row.featured === 1,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInquiryRow(row: InquiryRow): ProjectInquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    projectDescription: row.project_description,
    projectType: row.project_type,
    budgetRange: row.budget_range,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function listActivePricingPackages() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT *
       FROM pricing_packages
       WHERE active = 1
       ORDER BY display_order ASC, created_at ASC`,
    )
    .all() as Array<PackageRow>;

  return rows.map(mapPackageRow);
}

export function createProjectInquiry(input: ProjectInquiryInput): ProjectInquiry {
  const db = getDb();
  const id = newId();
  const createdAt = nowIso();

  db.prepare(
    `INSERT INTO project_inquiries
       (id, name, email, phone, company, project_description, project_type, budget_range, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
  ).run(
    id,
    cleanText(input.name, 120),
    cleanText(input.email, 200),
    toNullable(input.phone, 40),
    toNullable(input.company, 160),
    cleanMultiline(input.projectDescription, 5000),
    toNullable(input.projectType, 80),
    toNullable(input.budgetRange, 80),
    toNullable(input.message, 5000),
    createdAt,
  );

  const row = db
    .prepare("SELECT * FROM project_inquiries WHERE id = ? LIMIT 1")
    .get(id) as InquiryRow | undefined;

  // Row is guaranteed to exist immediately after insert.
  return mapInquiryRow(row as InquiryRow);
}
