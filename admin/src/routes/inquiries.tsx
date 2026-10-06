import { createFileRoute } from "@tanstack/react-router";
import { Mail, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminShell } from "../components/admin-shell";
import { requireAdminRoute } from "../lib/cms/admin-guard";
import {
  deleteProjectInquiryFn,
  getAdminSessionFn,
  listProjectInquiriesFn,
  setInquiryStatusFn,
} from "../lib/cms/server-fns";
import { INQUIRY_STATUSES, type InquiryStatus, type ProjectInquiry } from "../lib/cms/types";
import { formatDate } from "../lib/utils";

export const Route = createFileRoute("/inquiries")({
  beforeLoad: requireAdminRoute,
  loader: async () => {
    const [session, result] = await Promise.all([
      getAdminSessionFn(),
      listProjectInquiriesFn({ data: {} }),
    ]);
    return { session, inquiries: result.inquiries };
  },
  component: AdminInquiriesPage,
});

function AdminInquiriesPage() {
  const { session, inquiries: initialInquiries } = Route.useLoaderData();
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>(initialInquiries);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const base: Record<InquiryStatus, number> & { total: number } = {
      new: 0,
      contacted: 0,
      closed: 0,
      total: 0,
    };
    for (const item of inquiries) {
      base[item.status] += 1;
      base.total += 1;
    }
    return base;
  }, [inquiries]);

  const visible =
    filter === "all" ? inquiries : inquiries.filter((item) => item.status === filter);

  const onStatus = async (id: string, status: InquiryStatus) => {
    setBusyId(id);
    setError(null);
    try {
      const updated = await setInquiryStatusFn({ data: { id, status } });
      setInquiries((previous) =>
        previous.map((item) => (item.id === id ? { ...item, status: updated.status } : item)),
      );
    } catch {
      setError("Could not update the inquiry status.");
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this inquiry? This cannot be undone.")) return;
    setBusyId(id);
    setError(null);
    try {
      await deleteProjectInquiryFn({ data: { id } });
      setInquiries((previous) => previous.filter((item) => item.id !== id));
    } catch {
      setError("Could not delete the inquiry.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminShell
      current="inquiries"
      title="Inquiries"
      subtitle="Custom project requests submitted from the pricing section"
      sessionEmail={session?.email ?? "Admin"}
    >
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-head">
            <span className="admin-stat-icon">
              <Mail size={15} />
            </span>
            <p>Total</p>
          </div>
          <strong>{counts.total}</strong>
        </div>
        <div className="admin-stat-card tone-rust">
          <div className="admin-stat-head">
            <span className="admin-stat-icon">
              <Mail size={15} />
            </span>
            <p>New</p>
          </div>
          <strong>{counts.new}</strong>
        </div>
        <div className="admin-stat-card tone-amber">
          <div className="admin-stat-head">
            <span className="admin-stat-icon">
              <Mail size={15} />
            </span>
            <p>Contacted</p>
          </div>
          <strong>{counts.contacted}</strong>
        </div>
        <div className="admin-stat-card tone-green">
          <div className="admin-stat-head">
            <span className="admin-stat-icon">
              <Mail size={15} />
            </span>
            <p>Closed</p>
          </div>
          <strong>{counts.closed}</strong>
        </div>
      </div>

      <section className="admin-card">
        <div className="admin-card-header">
          <h2>Project inquiries</h2>
          <span className="admin-count-badge">{visible.length} shown</span>
        </div>

        <div className="admin-inquiry-filters">
          {(["all", ...INQUIRY_STATUSES] as Filter[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`admin-chip ${filter === key ? "is-active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {filterLabels[key]}
              {key === "all" ? ` (${counts.total})` : ` (${counts[key]})`}
            </button>
          ))}
        </div>

        {error ? <p className="admin-form-message is-error">{error}</p> : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Project</th>
                <th>Type</th>
                <th>Budget</th>
                <th>Received</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-empty-cell">
                    No inquiries yet. Submissions from the pricing section will appear here.
                  </td>
                </tr>
              ) : (
                visible.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-list-title">{item.name}</div>
                      <a className="admin-list-slug" href={`mailto:${item.email}`}>
                        {item.email}
                      </a>
                      {item.phone ? <div className="admin-list-slug">{item.phone}</div> : null}
                      {item.company ? <div className="admin-list-slug">{item.company}</div> : null}
                    </td>
                    <td>
                      <div className="admin-inquiry-message">{item.projectDescription}</div>
                      {item.message ? (
                        <div className="admin-inquiry-note">{item.message}</div>
                      ) : null}
                    </td>
                    <td>{item.projectType ?? "—"}</td>
                    <td>{item.budgetRange ?? "—"}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      <span
                        className={`admin-status-pill ${
                          item.status === "new" ? "published" : "draft"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        {INQUIRY_STATUSES.filter((status) => status !== item.status).map(
                          (status) => (
                            <button
                              key={status}
                              type="button"
                              className="admin-chip"
                              disabled={busyId === item.id}
                              onClick={() => onStatus(item.id, status)}
                            >
                              Mark {status}
                            </button>
                          ),
                        )}
                        <button
                          type="button"
                          className="admin-chip danger"
                          disabled={busyId === item.id}
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}

type Filter = "all" | InquiryStatus;

const filterLabels: Record<Filter, string> = {
  all: "All",
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};
