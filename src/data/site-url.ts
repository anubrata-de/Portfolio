/**
 * The site's public address, worked out at build time on the server. Kept out
 * of site.ts on purpose: site.ts is also imported by browser components, and
 * this file should never ship to the browser (not even the variable names).
 * Import it only from server files such as layout, sitemap and robots.
 */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
