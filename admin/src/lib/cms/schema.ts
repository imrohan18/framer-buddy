import { z } from "zod";

import { PROJECT_CATEGORIES, PROJECT_STATUS } from "./categories";
import { INQUIRY_STATUSES, PRICING_CTA_TYPES } from "./types";

const imagePathSchema = z.string().trim().startsWith("/uploads/projects/").max(500);

export const projectInputSchema = z.object({
  title: z.string().trim().min(3).max(140),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(PROJECT_CATEGORIES),
  shortDescription: z.string().trim().min(24).max(300),
  description: z.string().trim().min(24).max(25000),
  mainImage: imagePathSchema.nullable().optional(),
  thumbnailImage: imagePathSchema.nullable().optional(),
  mobileImage: imagePathSchema.nullable().optional(),
  galleryImages: z.array(imagePathSchema).max(12).default([]),
  technologies: z.array(z.string().trim().min(1).max(40)).min(1).max(20),
  projectUrl: z.union([z.literal(""), z.string().trim().url()]).optional(),
  caseStudyUrl: z.union([z.literal(""), z.string().trim().url()]).optional(),
  githubUrl: z.union([z.literal(""), z.string().trim().url()]).optional(),
  clientName: z.string().trim().max(120).optional(),
  year: z.number().int().min(1990).max(2100).nullable().optional(),
  featured: z.boolean().default(false),
  status: z.enum(PROJECT_STATUS),
  displayOrder: z.number().int().min(0).max(9999).default(100),
});

export const projectListFilterSchema = z.object({
  search: z.string().trim().max(120).optional(),
  category: z.enum(PROJECT_CATEGORIES).optional(),
  status: z.enum(PROJECT_STATUS).optional(),
  sort: z.enum(["newest", "displayOrder"]).default("newest"),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectListFilterInput = z.infer<typeof projectListFilterSchema>;

export const pricingPackageInputSchema = z.object({
  badge: z.string().trim().max(60).optional(),
  title: z.string().trim().min(2).max(140),
  price: z.string().trim().min(1).max(40),
  priceLabel: z.string().trim().max(60).optional(),
  description: z.string().trim().min(10).max(1000),
  features: z.array(z.string().trim().min(1).max(140)).max(20).default([]),
  ctaText: z.string().trim().min(2).max(60),
  ctaType: z.enum(PRICING_CTA_TYPES),
  pdfUrl: z.string().trim().max(500).optional(),
  detailsUrl: z.string().trim().max(500).optional(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).max(9999).default(100),
});

export const inquiryStatusSchema = z.enum(INQUIRY_STATUSES);

export const inquiryListFilterSchema = z.object({
  status: inquiryStatusSchema.optional(),
});

export type PricingPackageInput = z.infer<typeof pricingPackageInputSchema>;
export type InquiryStatusInput = z.infer<typeof inquiryStatusSchema>;
export type InquiryListFilterInput = z.infer<typeof inquiryListFilterSchema>;

/* ============================================================
   BLOG POST SCHEMA
   ============================================================ */

import { BLOG_CATEGORIES } from "./types";

const blogImagePathSchema = z.string().trim().startsWith("/uploads/projects/").max(500);

export const blogPostInputSchema = z.object({
  title: z.string().trim().min(3).max(240),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(BLOG_CATEGORIES),
  excerpt: z.string().trim().min(10).max(400),
  content: z.string().trim().min(10).max(100000),
  coverImage: blogImagePathSchema.nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(60)).max(10).default([]),
  author: z.string().trim().max(120).default("HYRUX Team"),
  readingTime: z.number().int().min(1).max(120).default(5),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().trim().optional(),
  seoTitle: z.string().trim().max(120).optional(),
  seoDescription: z.string().trim().max(300).optional(),
  ogImage: blogImagePathSchema.nullable().optional(),
});

export const blogPostFilterSchema = z.object({
  search: z.string().trim().max(120).optional(),
  category: z.enum(BLOG_CATEGORIES).optional(),
  status: z.enum(["draft", "published"]).optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
});

export type BlogPostInput = z.infer<typeof blogPostInputSchema>;
export type BlogPostFilterInput = z.infer<typeof blogPostFilterSchema>;
