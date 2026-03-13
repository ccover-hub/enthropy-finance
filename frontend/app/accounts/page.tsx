"use client";

import { useEffect, useState } from "react";
import { CurrencyBadge } from "@/components/currency-badge";
import { api, type AccountBalance } from "@/lib/api";

export default function AccountsPage() {
  const [balances, setBalances] = useState<Record<string, AccountBalance[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.balances().then(setBalances).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-400 text-sm">Error: {error}</p>;

  const groups: Record<string, [string, AccountBalance[]][]> = {
    Activos: Object.entries(balances).filter(([a]) => a.startsWith("Assets:")),
    Pasivos: Object.entries(balances).filter(([a]) => a.startsWith("Liabilities:")),
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="animate-fade-in-up">
        <p className="text-[11px] text-[#52525b] uppercase tracking-[0.15em] mb-1">
          Balance
        </p>
        <h1
          className="text-3xl tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Cuentas
        </h1>
      </div>

      {Object.entries(groups).map(([group, accounts], gIdx) => (
        <div
          key={group}
          className={`finance-card rounded-xl p-6 animate-fade-in-up stagger-${gIdx + 1}`}
        >
          <h2
            className="text-lg mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {group}
          </h2>
          <table className="w-full finance-table">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3">Cuenta</th>
                <th className="text-right py-3">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(([account, positions]) => (
                <tr key={account}>
                  <td className="py-3 text-sm font-mono-numbers">{account}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {positions.map((p, i) => (
                        <CurrencyBadge key={i} currency={p.currency} amount={p.amount} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
