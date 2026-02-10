/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Tenant website settings: keep nice URL, serve internal tenant-website page
      {
        source: "/r/:tenantSlug/dashboard/website",
        destination: "/dashboard/tenant-website?tenantSlug=:tenantSlug"
      },
      // Tenant dashboard root → overview page (keeps tenantSlug in URL)
      {
        source: "/r/:tenantSlug/dashboard",
        destination: "/dashboard/overview?tenantSlug=:tenantSlug"
      },
      // All other tenant dashboard pages
      {
        source: "/r/:tenantSlug/dashboard/:path*",
        destination: "/dashboard/:path*?tenantSlug=:tenantSlug"
      }
    ];
  }
};

module.exports = nextConfig;
