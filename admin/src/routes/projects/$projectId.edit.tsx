import { createFileRoute, notFound } from "@tanstack/react-router";

import { AdminShell } from "../../components/admin-shell";
import { ProjectForm } from "../../components/project-form";
import { requireAdminRoute } from "../../lib/cms/admin-guard";
import { getAdminSessionFn, getProjectByIdFn } from "../../lib/cms/server-fns";

export const Route = createFileRoute("/projects/$projectId/edit")({
  beforeLoad: requireAdminRoute,
  loader: async ({ params }) => {
    const [session, project] = await Promise.all([
      getAdminSessionFn(),
      getProjectByIdFn({ data: { id: params.projectId } }),
    ]);

    if (!project) {
      throw notFound();
    }

    return { session, project };
  },
  component: EditProjectPage,
});

function EditProjectPage() {
  const { session, project } = Route.useLoaderData();

  return (
    <AdminShell
      current="projects"
      title="Edit Project"
      subtitle="Update content, media, and publishing options"
      sessionEmail={session?.email ?? "Admin"}
    >
      <ProjectForm mode="edit" initialProject={project} onSaved={() => undefined} />
    </AdminShell>
  );
}
