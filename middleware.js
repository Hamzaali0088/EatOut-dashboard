import { NextResponse } from "next/server";
import { verifyJwt } from "./lib/auth";

function buildLoginRedirect(request, pathname, tenantDashboardMatch) {
  const url = request.nextUrl.clone();

  if (tenantDashboardMatch) {
    const slug = tenantDashboardMatch[1];
    const role = tenantDashboardMatch[2];
    url.pathname = role ? `/r/${slug}/${role}/login` : `/r/${slug}/login`;
  } else {
    url.pathname = "/login";
  }

  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect legacy platform dashboard and tenant dashboards
  const isPlatformDashboard = pathname.startsWith("/dashboard");
  const tenantDashboardMatch = pathname.match(/^\/r\/([^/]+)\/(?:([^/]+)\/)?dashboard(\/.*)?$/);

  if (!isPlatformDashboard && !tenantDashboardMatch) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return buildLoginRedirect(request, pathname, tenantDashboardMatch);
  }

  const payload = await verifyJwt(token);

  const allowedRoles = [
    "super_admin",
    "restaurant_admin",
    "staff",
    "admin",
    "product_manager",
    "cashier",
    "manager",
    "kitchen_staff"
  ];
  if (!payload || !allowedRoles.includes(payload.role)) {
    return buildLoginRedirect(request, pathname, tenantDashboardMatch);
  }

  // Optional: prevent cross-tenant access if JWT contains tenantSlug
  if (tenantDashboardMatch && payload.tenantSlug) {
    const slugFromPath = tenantDashboardMatch[1];
    if (slugFromPath !== payload.tenantSlug) {
      return buildLoginRedirect(request, pathname, tenantDashboardMatch);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/r/:tenantSlug/dashboard/:path*",
    "/r/:tenantSlug/:role/dashboard/:path*"
  ]
};

