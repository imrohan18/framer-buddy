import { getDb, nowIso } from "./db.server";
import { sanitizeText, toNullableString } from "./sanitize";
import type { PricingPackageInput } from "./schema";
import type { PricingCtaType, PricingPackage } from "./types";

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

function safeParseStringArray(input: string) {
  try {
    const parsed = JSON.parse(input) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
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

export function listPricingPackages() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT *
       FROM pricing_packages
       ORDER BY display_order ASC, created_at ASC`,
    )
    .all() as Array<PackageRow>;

  return rows.map(mapPackageRow);
}

export function updatePricingPackage(id: string, input: PricingPackageInput): PricingPackage {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM pricing_packages WHERE id = ? LIMIT 1").get(id) as
    | { id: string }
    | undefined;

  if (!existing) {
    throw new Error("Pricing package not found.");
  }

  const features = Array.from(
    new Set(input.features.map((feature) => sanitizeText(feature, 140)).filter(Boolean)),
  );

  db.prepare(
    `UPDATE pricing_packages
       SET badge = ?, title = ?, price = ?, price_label = ?, description = ?, features = ?,
           cta_text = ?, cta_type = ?, pdf_url = ?, details_url = ?, active = ?, featured = ?,
           display_order = ?, updated_at = ?
     WHERE id = ?`,
  ).run(
    toNullableString(input.badge),
    sanitizeText(input.title, 140),
    sanitizeText(input.price, 40),
    toNullableString(input.priceLabel),
    sanitizeText(input.description, 1000),
    JSON.stringify(features),
    sanitizeText(input.ctaText, 60),
    input.ctaType,
    toNullableString(input.pdfUrl),
    toNullableString(input.detailsUrl),
    input.active ? 1 : 0,
    input.featured ? 1 : 0,
    input.displayOrder,
    nowIso(),
    id,
  );

  const row = db.prepare("SELECT * FROM pricing_packages WHERE id = ? LIMIT 1").get(id) as PackageRow;
  return mapPackageRow(row);
}
