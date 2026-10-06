import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { PROJECT_CATEGORIES, PROJECT_STATUS } from "./categories";
import {
  inquiryListFilterSchema,
  inquiryStatusSchema,
  pricingPackageInputSchema,
  projectInputSchema,
  projectListFilterSchema,
  blogPostInputSchema,
  blogPostFilterSchema,
} from "./schema";
import type { BlogPost as CmsBlogPost } from "./types";

const idSchema = z.object({ id: z.string().min(1) });

const removeImageSchema = z.object({
  id: z.string().min(1),
  imagePath: z.string().startsWith("/uploads/projects/"),
  imageKind: z.enum(["main", "thumbnail", "mobile", "gallery"]),
});

export const loginAdminFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email(),
      password: z.string().min(8).max(256),
    }),
  )
  .handler(async ({ data }) => {
    const { loginAdmin } = await import("./auth.server");
    return loginAdmin(data.email, data.password);
  });

export const logoutAdminFn = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutAdmin } = await import("./auth.server");
  return logoutAdmin();
});

export const getAdminSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getCurrentAdminSession } = await import("./auth.server");
  return getCurrentAdminSession();
});

export const getAdminDashboardFn = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdminSession } = await import("./auth.server");
  const { getDashboardOverview } = await import("./projects.server");
  requireAdminSession();
  return getDashboardOverview();
});

export const listAdminProjectsFn = createServerFn({ method: "GET" })
  .validator(projectListFilterSchema.optional())
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { listProjectsForAdmin } = await import("./projects.server");
    requireAdminSession();
    return listProjectsForAdmin(data ?? { sort: "newest" });
  });

export const getProjectByIdFn = createServerFn({ method: "GET" })
  .validator(idSchema)
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { getProjectById } = await import("./projects.server");
    requireAdminSession();
    return getProjectById(data.id);
  });

export const createProjectFn = createServerFn({ method: "POST" })
  .validator(projectInputSchema)
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { createProject } = await import("./projects.server");
    requireAdminSession();
    return createProject(data);
  });

export const updateProjectFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      input: projectInputSchema,
    }),
  )
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { updateProject } = await import("./projects.server");
    requireAdminSession();
    return updateProject(data.id, data.input);
  });

export const duplicateProjectFn = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { duplicateProject } = await import("./projects.server");
    requireAdminSession();
    return duplicateProject(data.id);
  });

export const deleteProjectFn = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { deleteProject } = await import("./projects.server");
    requireAdminSession();
    return deleteProject(data.id);
  });

export const setProjectStatusFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      status: z.enum(PROJECT_STATUS),
    }),
  )
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { setProjectStatus } = await import("./projects.server");
    requireAdminSession();
    return setProjectStatus(data.id, data.status);
  });

export const uploadProjectImageFn = createServerFn({ method: "POST" })
  .validator((payload: unknown) => {
    if (!(payload instanceof FormData)) {
      throw new Error("Upload payload must be FormData.");
    }
    return payload;
  })
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { saveUploadedProjectImage } = await import("./storage.server");
    requireAdminSession();

    const variant = data.get("variant");
    const file = data.get("file");

    if (
      variant !== "main" &&
      variant !== "thumbnail" &&
      variant !== "mobile" &&
      variant !== "gallery"
    ) {
      throw new Error("Invalid image variant.");
    }

    if (!(file instanceof File)) {
      throw new Error("Image file is required.");
    }

    return saveUploadedProjectImage(file, variant);
  });

export const removeProjectImageFn = createServerFn({ method: "POST" })
  .validator(removeImageSchema)
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { removeSingleProjectImage } = await import("./projects.server");
    requireAdminSession();
    return removeSingleProjectImage(data.id, data.imagePath, data.imageKind);
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
    const { listPublishedProjects } = await import("./projects.server");
    return listPublishedProjects(data?.limit ?? 24);
  });

export const getProjectBySlugFn = createServerFn({ method: "GET" })
  .validator(
    z.object({
      slug: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const { getProjectBySlug } = await import("./projects.server");
    return getProjectBySlug(data.slug);
  });

export const listPricingPackagesFn = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdminSession } = await import("./auth.server");
  const { listPricingPackages } = await import("./pricing.server");
  requireAdminSession();
  return listPricingPackages();
});

export const updatePricingPackageFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      input: pricingPackageInputSchema,
    }),
  )
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { updatePricingPackage } = await import("./pricing.server");
    requireAdminSession();
    return updatePricingPackage(data.id, data.input);
  });

export const listProjectInquiriesFn = createServerFn({ method: "GET" })
  .validator(inquiryListFilterSchema.optional())
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { getInquiryCounts, listProjectInquiries } = await import("./inquiries.server");
    requireAdminSession();
    const filter = data?.status ? { status: data.status } : {};
    return { inquiries: listProjectInquiries(filter), counts: getInquiryCounts() };
  });

export const setInquiryStatusFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      status: inquiryStatusSchema,
    }),
  )
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { setInquiryStatus } = await import("./inquiries.server");
    requireAdminSession();
    return setInquiryStatus(data.id, data.status);
  });

export const deleteProjectInquiryFn = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { deleteProjectInquiry } = await import("./inquiries.server");
    requireAdminSession();
    return deleteProjectInquiry(data.id);
  });

/* ============================================================
   BLOG POSTS — admin CRUD
   ============================================================ */

const blogIdSchema = z.object({ id: z.string().min(1) });

export const listBlogPostsFn = createServerFn({ method: "GET" })
  .validator(blogPostFilterSchema.optional())
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { listBlogPosts } = await import("./blog.posts.server");
    requireAdminSession();
    return listBlogPosts(data ?? { sort: "newest" });
  });

export const getBlogPostByIdFn = createServerFn({ method: "GET" })
  .validator(blogIdSchema)
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { getBlogPostById } = await import("./blog.posts.server");
    requireAdminSession();
    return getBlogPostById(data.id);
  });

export const createBlogPostFn = createServerFn({ method: "POST" })
  .validator(blogPostInputSchema)
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { createBlogPost } = await import("./blog.posts.server");
    requireAdminSession();
    return createBlogPost(data as unknown as NonNullable<Parameters<typeof createBlogPost>[0]>);
  });

export const updateBlogPostFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      input: blogPostInputSchema,
    }),
  )
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { updateBlogPost } = await import("./blog.posts.server");
    requireAdminSession();
    return updateBlogPost(data.id, data.input as unknown as CmsBlogPost);
  });

export const deleteBlogPostFn = createServerFn({ method: "POST" })
  .validator(blogIdSchema)
  .handler(async ({ data }) => {
    const { requireAdminSession } = await import("./auth.server");
    const { deleteBlogPost } = await import("./blog.posts.server");
    requireAdminSession();
    return deleteBlogPost(data.id);
  });

export const cmsSettingsFn = createServerFn({ method: "GET" }).handler(() => {
  // Settings are admin-only data even if they do not contain raw secrets.
  return import("./auth.server").then(({ requireAdminSession }) => {
    requireAdminSession();

    const adminEmail = process.env.CYRUX_ADMIN_EMAIL?.trim() || "admin@cyrux.local";
    return {
      categories: PROJECT_CATEGORIES,
      adminEmail,
      hasProductionCredentials:
        Boolean(process.env.CYRUX_ADMIN_EMAIL) && Boolean(process.env.CYRUX_ADMIN_PASSWORD_HASH),
    };
  });
});
