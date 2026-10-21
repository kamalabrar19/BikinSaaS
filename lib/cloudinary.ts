import { createHash } from "node:crypto";

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

/** Everything the panel uploads lands in this folder. */
export const CLOUDINARY_FOLDER = "bikinsaas/portfolio";

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

export function uploadSignature(config: CloudinaryConfig) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder: CLOUDINARY_FOLDER, timestamp };
  return {
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    folder: CLOUDINARY_FOLDER,
    timestamp,
    signature: signParams(params, config.apiSecret),
  };
}

export interface CloudinaryAsset {
  publicId: string;
  src: string;
  kind: "image" | "video";
  bytes: number;
  createdAt: string;
}

/** Newest first, from the panel's folder only. */
export async function listAssets(config: CloudinaryConfig): Promise<CloudinaryAsset[]> {
  const auth = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString("base64");
  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/resources/search`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      expression: `folder:${CLOUDINARY_FOLDER}`,
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
    src: optimise(item.secure_url),
    kind: item.resource_type === "video" ? "video" : "image",
    bytes: item.bytes,
    createdAt: item.created_at,
  }));
}

/**
 * Asks Cloudinary for the best format and quality for each visitor's browser
 * (f_auto, q_auto), so a phone gets a small file without anyone resizing by hand.
 */
export function optimise(url: string): string {
  return url.includes("/upload/f_auto") ? url : url.replace("/upload/", "/upload/f_auto,q_auto/");
}
