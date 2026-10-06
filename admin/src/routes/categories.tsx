import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "../components/admin-shell";
import { requireAdminRoute } from "../lib/cms/admin-guard";
import { cmsSettingsFn, getAdminSessionFn } from "../lib/cms/server-fns";

export const Route = createFileRoute("/categories")({
  beforeLoad: requireAdminRoute,
  loader: async () => {
    const [session, settings] = await Promise.all([getAdminSessionFn(), cmsSettingsFn()]);
    return { session, settings };
  },
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const { session, settings } = Route.useLoaderData();

  return (
    <AdminShell
      current="categories"
      title="Categories"
      subtitle="Available categories for project classification"
      sessionEmail={session?.email ?? "Admin"}
    >
      <section className="admin-card">
        <div className="admin-card-header">
          <h2>Project Categories</h2>
          <span className="admin-count-badge">{settings.categories.length} total</span>
        </div>
        <p className="admin-help-text">
          These categories are used to classify every project entry across the site.
        </p>
        <div className="admin-tag-list">
          {settings.categories.map((category) => (
            <span key={category} className="admin-tag static">
              {category}
            </span>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
