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
    <aside className="w-72 border-r border-white/[0.06] bg-[#0c0c0e] min-h-screen p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c8a24e] to-[#a07830] flex items-center justify-center">
            <span className="text-black font-bold text-sm">E</span>
          </div>
          <h1
            className="text-xl tracking-tight text-gold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Enthropy
          </h1>
        </div>
        <p className="text-[11px] text-[#52525b] uppercase tracking-[0.15em] ml-11">
          Finance
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-[#c8a24e]/10 text-[#dbb668]"
                  : "text-[#71717a] hover:text-[#a1a1aa] hover:bg-white/[0.03]"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-colors duration-200 ${
                  isActive ? "text-[#c8a24e]" : "text-[#52525b] group-hover:text-[#71717a]"
                }`}
              />
              <span className="font-medium">{link.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c8a24e]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1d] flex items-center justify-center">
            <span className="text-xs text-[#71717a]">CC</span>
          </div>
          <div>
            <p className="text-xs text-[#a1a1aa]">Enthropy</p>
            <p className="text-[10px] text-[#52525b]">MX · US</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
