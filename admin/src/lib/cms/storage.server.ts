import { randomUUID } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const uploadsRootFs = resolve(process.cwd(), "..", "frontend", "public", "uploads", "projects");
const uploadsPublicPrefix = "/uploads/projects";

const ALLOWED_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

export type ProjectImageVariant = "main" | "thumbnail" | "mobile" | "gallery";

export async function saveUploadedProjectImage(file: File, variant: ProjectImageVariant) {
  const extension = ALLOWED_TYPES.get(file.type);
  if (!extension) {
    throw new Error("Unsupported image type. Please upload JPG, PNG, or WEBP.");
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Image size must be between 1 byte and 8MB.");
  }

  const folder = join(uploadsRootFs, variant);
  mkdirSync(folder, { recursive: true });

  const rawBuffer = Buffer.from(await file.arrayBuffer());
  let targetBuffer = rawBuffer;
  let targetExt = extension;

  // Best-effort optimization: use sharp when available, otherwise store original file.
  try {
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default;
    targetBuffer = await sharp(rawBuffer).rotate().webp({ quality: 82 }).toBuffer();
    targetExt = "webp";
  } catch {
    // No-op fallback keeps uploads functional without native image dependencies.
  }

  const filename = `${Date.now()}-${randomUUID()}.${targetExt}`;
  const absolutePath = join(folder, filename);
  writeFileSync(absolutePath, targetBuffer);

  return {
    path: `${uploadsPublicPrefix}/${variant}/${filename}`,
    bytes: targetBuffer.byteLength,
    mimeType: targetExt === "webp" ? "image/webp" : file.type,
  };
}

export function removeProjectAsset(assetPath: string | null | undefined) {
  if (!assetPath || !assetPath.startsWith(`${uploadsPublicPrefix}/`)) {
    return;
  }

  const absolute = resolve(process.cwd(), "..", "frontend", "public", assetPath.replace(/^\//, ""));
  const allowedBase = `${uploadsRootFs}${process.platform === "win32" ? "\\" : "/"}`;
  if (!absolute.startsWith(allowedBase) && absolute !== uploadsRootFs) {
    return;
  }

  rmSync(absolute, { force: true });
}

export function removeProjectAssets(assetPaths: Array<string | null | undefined>) {
  for (const path of assetPaths) {
    removeProjectAsset(path);
  }
}
