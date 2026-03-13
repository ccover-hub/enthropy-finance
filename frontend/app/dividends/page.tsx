"use client";

import { useEffect, useState } from "react";
import { CurrencyBadge } from "@/components/currency-badge";
import { api, type Transaction, type AccountBalance } from "@/lib/api";
import { Clock, CheckCircle } from "lucide-react";

export default function DividendsPage() {
  const [balances, setBalances] = useState<Record<string, AccountBalance[]>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.balances(), api.transactions(500)])
      .then(([b, t]) => {
        setBalances(b);
        setTransactions(
          t.filter((txn) =>
            txn.postings.some((p) => p.account.includes("Dividend"))
          )
        );
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-400 text-sm">Error: {error}</p>;

  const pending = balances["Liabilities:Dividends:Pending"] || [];
  const paid = balances["Equity:Dividends:Paid"] || [];

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="animate-fade-in-up">
        <p className="text-[11px] text-[#52525b] uppercase tracking-[0.15em] mb-1">
          Distribucion
        </p>
        <h1
          className="text-3xl tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Dividendos
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="finance-card rounded-xl p-6 animate-fade-in-up stagger-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] text-[#52525b] uppercase tracking-[0.1em]">
                Pendientes
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#c8a24e]/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#c8a24e]" />
            </div>
          </div>
          {pending.length > 0 ? (
            <div className="space-y-2">
              {pending.map((p, i) => (
                <div key={i} className="font-mono-numbers text-2xl font-medium text-[#dbb668]">
                  {new Intl.NumberFormat(
                    p.currency === "MXN" ? "es-MX" : "en-US",
                    { style: "currency", currency: p.currency }
                  ).format(Math.abs(parseFloat(p.amount)))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#52525b]">Sin dividendos pendientes</p>
          )}
        </div>

        <div className="finance-card rounded-xl p-6 animate-fade-in-up stagger-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] text-[#52525b] uppercase tracking-[0.1em]">
                Pagados
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          {paid.length > 0 ? (
            <div className="space-y-2">
              {paid.map((p, i) => (
                <div key={i} className="font-mono-numbers text-2xl font-medium text-emerald-400">
                  {new Intl.NumberFormat(
                    p.currency === "MXN" ? "es-MX" : "en-US",
                    { style: "currency", currency: p.currency }
                  ).format(Math.abs(parseFloat(p.amount)))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#52525b]">Sin dividendos pagados</p>
          )}
        </div>
      </div>

      {/* History */}
      <div className="finance-card rounded-xl p-6 animate-fade-in-up stagger-3">
        <div className="mb-6">
          <p className="text-[11px] text-[#52525b] uppercase tracking-[0.1em] mb-1">
            Registro
          </p>
          <h2
            className="text-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Historial de Dividendos
          </h2>
        </div>
        <table className="w-full finance-table">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-3">Fecha</th>
              <th className="text-left py-3">Descripcion</th>
              <th className="text-right py-3">Monto</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => (
              <tr key={i}>
                <td className="py-3 font-mono-numbers text-[#71717a] text-sm">
                  {txn.date}
                </td>
                <td className="py-3 text-sm">
                  {txn.payee && (
                    <span className="font-medium">{txn.payee}</span>
                  )}
                  {txn.payee && txn.narration && (
                    <span className="text-[#52525b] mx-2">·</span>
                  )}
                  <span className="text-[#71717a]">{txn.narration}</span>
                </td>
                <td className="py-3 text-right">
                  {txn.postings
                    .filter((p) => p.account.includes("Dividend"))
                    .map((p, j) => (
                      <CurrencyBadge key={j} currency={p.currency} amount={p.amount} size="sm" />
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
