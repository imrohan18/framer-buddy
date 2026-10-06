import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "../components/admin-shell";
import { requireAdminRoute } from "../lib/cms/admin-guard";
import { cmsSettingsFn, getAdminSessionFn } from "../lib/cms/server-fns";

export const Route = createFileRoute("/settings")({
  beforeLoad: requireAdminRoute,
  loader: async () => {
    const [session, settings] = await Promise.all([getAdminSessionFn(), cmsSettingsFn()]);
    return { session, settings };
  },
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { session, settings } = Route.useLoaderData();

  return (
    <AdminShell
      current="settings"
      title="Settings"
      subtitle="Environment and security status for the CMS"
      sessionEmail={session?.email ?? "Admin"}
    >
      <section className="admin-card">
        <h2>Authentication</h2>
        <dl className="admin-detail-list">
          <div className="admin-detail-row">
            <dt>Configured admin account</dt>
            <dd>{settings.adminEmail}</dd>
          </div>
          <div className="admin-detail-row">
            <dt>Production credentials</dt>
            <dd>
              <span
                className={`admin-status-pill ${settings.hasProductionCredentials ? "published" : "draft"}`}
              >
                {settings.hasProductionCredentials ? "Configured" : "Not configured"}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="admin-card">
        <h2>Security Checklist</h2>
        <ul className="admin-checklist">
          <li>Protected admin routes and session cookies</li>
          <li>Server-side validation on all write operations</li>
          <li>Image file type and size validation</li>
          <li>Draft-only visibility enforcement for unpublished projects</li>
          <li>Single-featured-project enforcement</li>
        </ul>
      </section>
    </AdminShell>
  );
}
