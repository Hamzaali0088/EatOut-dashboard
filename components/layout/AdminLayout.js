import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  Receipt,
  UtensilsCrossed,
  Percent,
  History,
  Users,
  LogOut,
  Factory,
  Settings2,
  Sun,
  Moon
} from "lucide-react";
import { getToken } from "../../lib/apiClient";
import { useTheme } from "../../contexts/ThemeContext";
import { getTenantRoute } from "../../lib/routes";

// Base tenant dashboard routes (tenantSlug will be injected at runtime)
const tenantNav = [
  { path: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { path: "/dashboard/pos", label: "POS", icon: Receipt },
  { path: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
  { path: "/dashboard/inventory", label: "Inventory", icon: Factory },
  { path: "/dashboard/website", label: "Website Settings", icon: Settings2 },
  { path: "/dashboard/website-content", label: "Website Content", icon: Percent },
  { path: "/dashboard/history", label: "Reports", icon: History },
  { path: "/dashboard/users", label: "Users", icon: Users }
];

const superNav = [
  { href: "/dashboard/super/overview", label: "Platform Overview", icon: LayoutDashboard },
  { href: "/dashboard/super/restaurants", label: "Restaurants", icon: Factory },
  { href: "/dashboard/super/settings", label: "System Settings", icon: Settings2 }
];

function decodeRoleFromToken(token) {
  if (!token || typeof window === "undefined") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    // Decode JWT payload in browser without Buffer
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = window.atob(base64);
    const payload = JSON.parse(json);
    return payload.role || null;
  } catch {
    return null;
  }
}

export default function AdminLayout({ title, children }) {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const token = getToken();
    const r = decodeRoleFromToken(token);
    setRole(r);
  }, []);

  const navItems = role === "super_admin" ? superNav : tenantNav;
  const roleLabel =
    role === "super_admin" ? "Super Admin" : role === "restaurant_admin" ? "Restaurant Admin" : "Staff";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex text-gray-900 dark:text-white">
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-neutral-800 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold">
            EO
          </span>
          <div>
            <div className="font-semibold tracking-tight text-gray-900 dark:text-white">RestaurantOS</div>
            <div className="text-xs text-gray-500 dark:text-neutral-400">
              {role === "super_admin" ? "Platform Console" : "Restaurant Dashboard"}
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            // Super admin nav uses absolute hrefs
            const href =
              role === "super_admin"
                ? item.href
                : getTenantRoute(router.asPath || router.pathname, item.path);

            const isActive = router.asPath.startsWith(href);
            const Icon = item.icon;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 text-red-600 dark:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              EO
            </span>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">RestaurantOS</div>
              <div className="text-[11px] text-gray-500 dark:text-neutral-400">
                {role === "super_admin" ? "Platform Console" : "Restaurant Dashboard"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 text-red-600 dark:text-red-400"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </header>

        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h1>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
              {role === "super_admin"
                ? "Manage restaurants, subscriptions and platform configuration."
                : "Manage menu, inventory, website and staff for this restaurant."}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 font-medium transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </>
              )}
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-neutral-400">
              Logged in as <span className="text-gray-900 dark:text-white font-medium">{roleLabel}</span>
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto bg-white dark:bg-black">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}


