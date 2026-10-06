import type { ProjectCategory, ProjectStatus } from "./categories";

export type CmsProject = {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  shortDescription: string;
  description: string;
  mainImage: string | null;
  thumbnailImage: string | null;
  mobileImage: string | null;
  galleryImages: string[];
  technologies: string[];
  projectUrl: string | null;
  caseStudyUrl: string | null;
  githubUrl: string | null;
  clientName: string | null;
  year: number | null;
  featured: boolean;
  status: ProjectStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectListItem = Pick<
  CmsProject,
  "id" | "title" | "slug" | "category" | "status" | "featured" | "displayOrder" | "updatedAt" | "mainImage"
>;

export const PRICING_CTA_TYPES = ["pdf", "details", "inquiry"] as const;
export type PricingCtaType = (typeof PRICING_CTA_TYPES)[number];

export type PricingPackage = {
  id: string;
  badge: string | null;
  title: string;
  price: string;
  priceLabel: string | null;
  description: string;
  features: string[];
  ctaText: string;
  ctaType: PricingCtaType;
  pdfUrl: string | null;
  detailsUrl: string | null;
  active: boolean;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export const INQUIRY_STATUSES = ["new", "contacted", "closed"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export type ProjectInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  projectDescription: string;
  projectType: string | null;
  budgetRange: string | null;
  message: string | null;
  status: InquiryStatus;
  createdAt: string;
};

export type ProjectInquiryInput = {
  name: string;
  email: string;
  phone?: string | undefined;
  company?: string | undefined;
  projectDescription: string;
  projectType?: string | undefined;
  budgetRange?: string | undefined;
  message?: string | undefined;
};

export const INQUIRY_PROJECT_TYPES = [
  "Website",
  "Full-Stack Application",
  "Custom Software",
  "SaaS",
  "AI / ML",
  "Data & Analytics",
  "Automation",
  "Other",
] as const;

export const INQUIRY_BUDGET_RANGES = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000+",
  "Not sure yet",
] as const;

/* ============================================================
   BLOG POST TYPES
   ============================================================ */

export const BLOG_CATEGORIES = [
  "Technology",
  "AI / ML",
  "Data",
  "Business",
  "Product",
  "Engineering",
  "Automation",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: BlogCategory;
  tags: string[];
  author: string;
  readingTime: number;
  featured: boolean;
  status: BlogStatus;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogListItem = Pick<
  BlogPost,
  "id" | "title" | "slug" | "excerpt" | "coverImage" | "category" | "tags" | "author" | "readingTime" | "featured" | "status" | "publishedAt" | "createdAt" | "updatedAt"
>;
