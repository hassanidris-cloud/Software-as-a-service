"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, QrCode } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Product Manager", icon: Package },
  { href: "/dashboard/scan", label: "Stamp Scanner", icon: QrCode }
];

function getActiveStyles(active: boolean) {
  return active
    ? "border-indigo-400/50 bg-indigo-500/15 text-indigo-100"
    : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white";
}

type DashboardSidebarProps = {
  fullName: string;
  businessName: string | null;
};

export function DashboardSidebar({ fullName, businessName }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-slate-800 bg-slate-950 md:min-h-screen md:w-72 md:border-r md:border-b-0">
      <div className="border-b border-slate-800 px-5 py-4">
        <p className="text-sm text-slate-400">LoyaltySphere</p>
        <h1 className="text-lg font-semibold text-white">Business Dashboard</h1>
        <p className="mt-2 text-xs text-slate-400">{fullName}</p>
        {businessName && <p className="text-xs text-indigo-200">{businessName}</p>}
      </div>

      <nav className="grid grid-cols-1 gap-2 px-3 py-4 sm:grid-cols-3 md:grid-cols-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition ${getActiveStyles(
                isActive
              )}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-3 py-4">
        <SignOutButton />
      </div>
    </aside>
  );
}
