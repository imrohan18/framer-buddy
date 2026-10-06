import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Format a date deterministically (fixed locale + UTC) so the value rendered
 * on the server matches the client and avoids hydration mismatches.
 */
export function formatDate(input: string | number | Date) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "—";
  return dateFormatter.format(date);
}
