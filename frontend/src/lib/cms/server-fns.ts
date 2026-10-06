import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { INQUIRY_BUDGET_RANGES, INQUIRY_PROJECT_TYPES } from "./types";

const projectInquiryInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(160).optional(),
  projectDescription: z.string().trim().min(10).max(5000),
  projectType: z.enum(INQUIRY_PROJECT_TYPES).optional(),
  budgetRange: z.enum(INQUIRY_BUDGET_RANGES).optional(),
  message: z.string().trim().max(5000).optional(),
});

export const listPricingPackagesFn = createServerFn({ method: "GET" }).handler(async () => {
  const { listActivePricingPackages } = await import("./public-pricing.server");
  return listActivePricingPackages();
});

export const submitProjectInquiryFn = createServerFn({ method: "POST" })
  .validator(projectInquiryInputSchema)
  .handler(async ({ data }) => {
    const { createProjectInquiry } = await import("./public-pricing.server");
    return createProjectInquiry(data);
  });

export const listPublishedProjectsFn = createServerFn({ method: "GET" })
  .validator(
    z
      .object({
        limit: z.number().int().min(1).max(120).optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    const { listPublishedProjects } = await import("./public-projects.server");
    return listPublishedProjects(data?.limit ?? 24);
  });

/* ============================================================
   BLOG — public read-only access
   ============================================================ */

export const listPublishedBlogPostsFn = createServerFn({ method: "GET" })
  .validator(
    z
      .object({
        limit: z.number().int().min(1).max(120).optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    const { listPublishedBlogPosts } = await import("./public-blog.server");
    return listPublishedBlogPosts(data?.limit ?? 24);
  });

export const getPublishedBlogPostBySlugFn = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getPublishedBlogPostBySlug, getLatestPublishedBlogPost } = await import("./public-blog.server");
    return getPublishedBlogPostBySlug(data.slug) ?? getLatestPublishedBlogPost();
});

export const getProjectBySlugFn = createServerFn({ method: "GET" })
  .validator(
    z.object({
      slug: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const { getProjectBySlug } = await import("./public-projects.server");
    return getProjectBySlug(data.slug);
  });
