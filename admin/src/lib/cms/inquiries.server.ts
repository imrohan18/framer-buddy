import { getDb } from "./db.server";
import type { InquiryStatus, ProjectInquiry } from "./types";

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

export function listProjectInquiries(filter: { status?: InquiryStatus } = {}) {
  const db = getDb();
  const rows = filter.status
    ? (db
        .prepare("SELECT * FROM project_inquiries WHERE status = ? ORDER BY created_at DESC")
        .all(filter.status) as Array<InquiryRow>)
    : (db
        .prepare("SELECT * FROM project_inquiries ORDER BY created_at DESC")
        .all() as Array<InquiryRow>);

  return rows.map(mapInquiryRow);
}

export function getInquiryCounts() {
  const db = getDb();
  const rows = db
    .prepare("SELECT status, COUNT(*) AS count FROM project_inquiries GROUP BY status")
    .all() as Array<{ status: InquiryStatus; count: number }>;

  const counts: Record<InquiryStatus, number> = { new: 0, contacted: 0, closed: 0 };
  for (const row of rows) {
    counts[row.status] = row.count;
  }

  return { ...counts, total: counts.new + counts.contacted + counts.closed };
}

export function setInquiryStatus(id: string, status: InquiryStatus): ProjectInquiry {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM project_inquiries WHERE id = ? LIMIT 1").get(id) as
    | { id: string }
    | undefined;

  if (!existing) {
    throw new Error("Inquiry not found.");
  }

  db.prepare("UPDATE project_inquiries SET status = ? WHERE id = ?").run(status, id);

  const row = db.prepare("SELECT * FROM project_inquiries WHERE id = ? LIMIT 1").get(id) as InquiryRow;
  return mapInquiryRow(row);
}

export function deleteProjectInquiry(id: string) {
  const db = getDb();
  db.prepare("DELETE FROM project_inquiries WHERE id = ?").run(id);
  return { id };
}
