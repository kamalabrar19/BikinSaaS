import { createHash } from "node:crypto";

import { VIDEO_TRANSFORM, optimiseMedia } from "@/lib/media-url";

/**
 * Cloudinary, without the SDK: three small calls are all the panel needs.
 *
 * Uploads go from the browser straight to Cloudinary using a signature this
 * server makes, so a large video never passes through (or is capped by) this
 * app's own request limits, and the secret never reaches the browser.
 *
 * Configure with CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY /
 * CLOUDINARY_API_SECRET, or the single CLOUDINARY_URL Cloudinary shows in its
 * dashboard (cloudinary://KEY:SECRET@CLOUD).
 */

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

/** Everything the panel uploads lives under this folder. */
export const CLOUDINARY_ROOT = "BikinSaaS";

/** One subfolder per kind of upload, so the media library stays tidy. */
export const CLOUDINARY_FOLDERS = {
  portfolio: `${CLOUDINARY_ROOT}/portfolio`,
  tim: `${CLOUDINARY_ROOT}/tim`,
} as const;

export type UploadFolder = keyof typeof CLOUDINARY_FOLDERS;

export function isUploadFolder(value: unknown): value is UploadFolder {
  return typeof value === "string" && value in CLOUDINARY_FOLDERS;
}

export function cloudinaryConfig(): CloudinaryConfig | null {
  const url = process.env.CLOUDINARY_URL?.trim();
  if (url) {
    const match = /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/.exec(url);
    if (match) return { apiKey: match[1], apiSecret: match[2], cloudName: match[3] };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? "";
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim() ?? "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() ?? "";
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
}

/**
 * Cloudinary's signature: the parameters sorted by name and joined as
 * `key=value&key=value`, the secret appended, then SHA-1.
 */
export function signParams(params: Record<string, string | number>, secret: string): string {
  const base = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(base + secret).digest("hex");
}

export function uploadSignature(
  config: CloudinaryConfig,
  kind: UploadFolder = "portfolio",
  /** A video also asks Cloudinary to build the compressed variant right away, in the background. */
  video = false,
) {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = CLOUDINARY_FOLDERS[kind];
  const params: Record<string, string | number> = video
    ? { eager: VIDEO_TRANSFORM, eager_async: "true", folder, timestamp }
    : { folder, timestamp };
  return {
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    folder,
    timestamp,
    signature: signParams(params, config.apiSecret),
    ...(video ? { eager: VIDEO_TRANSFORM, eagerAsync: "true" } : {}),
  };
}

export interface CloudinaryAsset {
  publicId: string;
  src: string;
  kind: "image" | "video";
  bytes: number;
  createdAt: string;
}

/** Newest first, from every folder under the BikinSaaS root. */
export async function listAssets(config: CloudinaryConfig): Promise<CloudinaryAsset[]> {
  const auth = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString("base64");
  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/resources/search`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      expression: `folder:${CLOUDINARY_ROOT}/*`,
      sort_by: [{ created_at: "desc" }],
      max_results: 100,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Cloudinary menjawab ${response.status}.`);

  const data = (await response.json()) as {
    resources?: {
      public_id: string;
      secure_url: string;
      resource_type: string;
      bytes: number;
      created_at: string;
    }[];
  };

  return (data.resources ?? []).map((item) => ({
    publicId: item.public_id,
    src: optimiseMedia(item.secure_url),
    kind: item.resource_type === "video" ? "video" : "image",
    bytes: item.bytes,
    createdAt: item.created_at,
  }));
}
