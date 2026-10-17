import { fileURLToPath } from "node:url";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/**
 * `next dev` and `next build` write to separate folders. When they shared
 * `.next`, running a production build while the dev server was up overwrote
 * the dev server's chunks, and it started answering 500 with
 * "Cannot find module './611.js'" and "__webpack_modules__[moduleId] is not a
 * function".
 *
 * @param {string} phase
 * @returns {import('next').NextConfig}
 */
export default function nextConfig(phase) {
  return {
    reactStrictMode: true,
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    // A stray package-lock.json in the home directory made Next pick that
    // folder as the workspace root and warn on every start.
    outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
    async redirects() {
      // Indonesian is the default locale, so "/" goes to "/id". A 307 rather
      // than a 308: a permanent redirect on "/" is cached by browsers and is
      // painful to undo if the default ever changes.
      return [{ source: "/", destination: "/id", permanent: false }];
    },
  };
}
