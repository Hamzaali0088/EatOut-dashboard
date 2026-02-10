import { NextResponse } from "next/server";
import { verifyJwt } from "./lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect legacy platform dashboard and tenant dashboards
  const isPlatformDashboard = pathname.startsWith("/dashboard");
  const tenantDashboardMatch = pathname.match(/^\/r\/([^/]+)\/dashboard(\/.*)?$/);

  if (!isPlatformDashboard && !tenantDashboardMatch) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  const payload = await verifyJwt(token);

  const allowedRoles = ["super_admin", "restaurant_admin", "staff"];
  if (!payload || !allowedRoles.includes(payload.role)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Optional: prevent cross-tenant access if JWT contains tenantSlug
  if (tenantDashboardMatch && payload.tenantSlug) {
    const slugFromPath = tenantDashboardMatch[1];
    if (slugFromPath !== payload.tenantSlug) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/r/:tenantSlug/dashboard/:path*"]
};

