"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  FileText,
  CircleDollarSign,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transacciones", icon: ArrowLeftRight },
  { href: "/accounts", label: "Cuentas", icon: Wallet },
  { href: "/reports", label: "Reportes", icon: FileText },
  { href: "/dividends", label: "Dividendos", icon: CircleDollarSign },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Enthropy Finance</h1>
        <p className="text-sm text-muted-foreground">Control financiero</p>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-gray-200 dark:bg-gray-800 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
