/**
 * How uploaded media is delivered. Shared by the admin (which uploads) and the
 * public pages (which play), so both name exactly the same Cloudinary variant.
 *
 * Pictures take f_auto,q_auto: the best format and quality for each browser.
 * Videos are re-encoded to H.264 MP4, capped at 1280px wide with eco quality —
 * a phone-sized file instead of the raw camera recording. The upload asks
 * Cloudinary to build that variant straight away (see uploadSignature), so the
 * first visitor does not wait for it.
 */

export const VIDEO_TRANSFORM = "f_mp4,vc_h264,q_auto:eco,w_1280,c_limit";
export const IMAGE_TRANSFORM = "f_auto,q_auto";

const OLD_IMAGE = `/upload/${IMAGE_TRANSFORM}/`;

/** Adds the delivery transformation to a Cloudinary URL; any other URL is returned untouched. */
export function optimiseMedia(url: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  const isVideo = url.includes("/video/upload/");
  const wanted = isVideo ? VIDEO_TRANSFORM : IMAGE_TRANSFORM;
  if (url.includes(`/upload/${wanted}/`)) return url;
  /* Earlier uploads stored the generic f_auto,q_auto form; swap it, don't stack it. */
  const bare = url.includes(OLD_IMAGE) ? url.replace(OLD_IMAGE, "/upload/") : url;
  return bare.replace("/upload/", `/upload/${wanted}/`);
}
