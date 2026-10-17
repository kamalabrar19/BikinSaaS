/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Indonesian is the default locale, so "/" goes to "/id". A 307 rather
    // than a 308: a permanent redirect on "/" is cached by browsers and is
    // painful to undo if the default ever changes.
    return [{ source: "/", destination: "/id", permanent: false }];
  },
};

export default nextConfig;
