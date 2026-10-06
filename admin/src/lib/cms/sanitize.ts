export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function sanitizeText(value: string, maxLength: number) {
  const normalized = value.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  return normalized.slice(0, maxLength);
}

export function toNullableString(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
