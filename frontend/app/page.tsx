"use client";

import { useEffect, useState } from "react";
import { CurrencyBadge } from "@/components/currency-badge";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { BalanceChart } from "@/components/charts/balance-chart";
import { api, type DashboardData } from "@/lib/api";
import { TrendingUp, TrendingDown, Clock, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.dashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-xl" />
          <div className="skeleton h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  // Calculate totals for summary
  const bankAccounts = Object.entries(data.balances).filter(([a]) =>
    a.startsWith("Assets:Bank")
  );

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="animate-fade-in-up">
        <p className="text-[11px] text-[#52525b] uppercase tracking-[0.15em] mb-1">
          Vista general
        </p>
        <h1
          className="text-3xl tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Dashboard
        </h1>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bankAccounts.map(([account, positions], idx) => (
          <div
            key={account}
            className={`finance-card rounded-xl p-5 animate-fade-in-up stagger-${idx + 1}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[11px] text-[#52525b] uppercase tracking-[0.1em]">
                  {account.replace("Assets:Bank:", "").replace(":", " · ")}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-[#52525b]" />
              </div>
            </div>
            <div className="space-y-2">
              {positions.map((p, i) => (
                <div key={i} className="font-mono-numbers text-xl font-medium tracking-tight">
                  {new Intl.NumberFormat(
                    p.currency === "MXN" ? "es-MX" : "en-US",
                    { style: "currency", currency: p.currency }
                  ).format(parseFloat(p.amount))}
                  <span className="text-xs text-[#52525b] ml-1.5">{p.currency}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Pending Dividends Card */}
        <div className="finance-card rounded-xl p-5 animate-fade-in-up stagger-3">
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] text-[#52525b] uppercase tracking-[0.1em]">
              Dividendos Pendientes
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#c8a24e]/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#c8a24e]" />
            </div>
          </div>
          {data.pending_dividends.length > 0 ? (
            <div className="space-y-2">
              {data.pending_dividends.map((p, i) => (
                <div key={i} className="font-mono-numbers text-xl font-medium tracking-tight text-[#dbb668]">
                  {new Intl.NumberFormat(
                    p.currency === "MXN" ? "es-MX" : "en-US",
                    { style: "currency", currency: p.currency }
                  ).format(Math.abs(parseFloat(p.amount)))}
                  <span className="text-xs text-[#52525b] ml-1.5">{p.currency}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#52525b]">Sin pendientes</p>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="finance-card rounded-xl p-6 animate-fade-in-up stagger-4">
          <div className="mb-6">
            <p className="text-[11px] text-[#52525b] uppercase tracking-[0.1em] mb-1">
              Resumen
            </p>
            <h2
              className="text-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ingresos vs Gastos
            </h2>
          </div>
          <IncomeExpenseChart
            income={data.income_vs_expenses.income}
            expenses={data.income_vs_expenses.expenses}
          />
        </div>

        <div className="finance-card rounded-xl p-6 animate-fade-in-up stagger-5">
          <div className="mb-6">
            <p className="text-[11px] text-[#52525b] uppercase tracking-[0.1em] mb-1">
              Distribucion
            </p>
            <h2
              className="text-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Saldos por Cuenta
            </h2>
          </div>
          <BalanceChart balances={data.balances} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="finance-card rounded-xl p-6 animate-fade-in-up stagger-6">
        <div className="mb-6">
          <p className="text-[11px] text-[#52525b] uppercase tracking-[0.1em] mb-1">
            Actividad reciente
          </p>
          <h2
            className="text-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Transacciones
          </h2>
        </div>
        <table className="w-full finance-table">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-3 pr-4">Fecha</th>
              <th className="text-left py-3 pr-4">Descripcion</th>
              <th className="text-right py-3">Monto</th>
            </tr>
          </thead>
          <tbody>
            {data.recent_transactions.map((txn, i) => (
              <tr key={i}>
                <td className="py-3 pr-4 font-mono-numbers text-[#71717a] text-sm">
                  {txn.date}
                </td>
                <td className="py-3 pr-4 text-sm">
                  {txn.payee && (
                    <span className="text-[#fafafa] font-medium">{txn.payee}</span>
                  )}
                  {txn.payee && txn.narration && (
                    <span className="text-[#52525b] mx-2">·</span>
                  )}
                  <span className="text-[#71717a]">{txn.narration}</span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex flex-col items-end gap-1">
                    {txn.postings
                      .filter(
                        (p) =>
                          !p.account.startsWith("Income:") &&
                          !p.account.startsWith("Expenses:")
                      )
                      .map((p, j) => (
                        <CurrencyBadge
                          key={j}
                          currency={p.currency}
                          amount={p.amount}
                          size="sm"
                        />
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
