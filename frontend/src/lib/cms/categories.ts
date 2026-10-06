export const PROJECT_CATEGORIES = [
  "Website",
  "Full-Stack",
  "SaaS",
  "Custom Software",
  "AI / ML",
  "Data & Analytics",
  "E-Commerce",
  "Mobile App",
  "Other",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUS = ["draft", "published"] as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[number];
