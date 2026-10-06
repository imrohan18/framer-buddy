import { redirect } from "@tanstack/react-router";

import { getAdminSessionFn } from "./server-fns";

export async function requireAdminRoute() {
  const session = await getAdminSessionFn();
  if (!session) {
    throw redirect({ to: "/login" });
  }

  return session;
}

export async function redirectIfAdmin() {
  const session = await getAdminSessionFn();
  if (session) {
    throw redirect({ to: "/dashboard" });
  }

  return null;
}
