import { createFileRoute, redirect } from "@tanstack/react-router";

import { getAdminSessionFn } from "../lib/cms/server-fns";

export const Route = createFileRoute("/")({
  loader: async () => {
    const session = await getAdminSessionFn();
    throw redirect({ to: session ? "/dashboard" : "/login" });
  },
  component: () => null,
});
