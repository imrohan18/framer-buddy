import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AdminShell } from "../../components/admin-shell";
import { ProjectForm } from "../../components/project-form";
import { requireAdminRoute } from "../../lib/cms/admin-guard";
import { getAdminSessionFn } from "../../lib/cms/server-fns";
import type { CmsProject } from "../../lib/cms/types";

export const Route = createFileRoute("/projects/new")({
  beforeLoad: requireAdminRoute,
  loader: async () => {
    const session = await getAdminSessionFn();
    return { session };
  },
  component: NewProjectPage,
});

function NewProjectPage() {
  const { session } = Route.useLoaderData();
  const navigate = useNavigate();

  const onSaved = async (project: CmsProject) => {
    await navigate({ to: "/projects/$projectId/edit", params: { projectId: project.id } });
  };

  return (
    <AdminShell
      current="add"
      title="Add Project"
      subtitle="Create a project, upload images, and publish instantly"
      sessionEmail={session?.email ?? "Admin"}
    >
      <ProjectForm mode="create" onSaved={onSaved} />
    </AdminShell>
  );
}
