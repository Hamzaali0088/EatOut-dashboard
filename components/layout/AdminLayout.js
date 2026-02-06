import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  Receipt,
  UtensilsCrossed,
  Percent,
  History,
  LogOut
} from "lucide-react";

const navItems = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: Receipt },
  { href: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/dashboard/deals", label: "Deals", icon: Percent },
  { href: "/dashboard/history", label: "Order History", icon: History }
];

export default function AdminLayout({ title, children }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-black flex text-white">
      <aside className="hidden md:flex w-64 flex-col border-r border-neutral-800 bg-neutral-950">
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-black font-bold">
            EO
          </span>
          <div>
            <div className="font-semibold tracking-tight">EatOut Admin</div>
            <div className="text-xs text-neutral-400">Restaurant Owner Panel</div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const isActive = router.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-black"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black font-bold">
              EO
            </span>
            <div>
              <div className="text-sm font-semibold">EatOut Admin</div>
              <div className="text-[11px] text-neutral-400">Restaurant Owner Panel</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-red-400"
          >
            <LogOut className="w-3 h-3" />
            Logout
          </button>
        </header>

        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-neutral-800 bg-neutral-950">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Manage orders, menu, deals and performance.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="px-2 py-1 rounded-full bg-neutral-900 border border-neutral-800">
              Logged in as <span className="text-white font-medium">Admin</span>
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto bg-black">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

