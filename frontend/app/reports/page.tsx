"use client";

import { useEffect, useState } from "react";
import { CurrencyBadge } from "@/components/currency-badge";
import { api, type ReportRow } from "@/lib/api";

export default function ReportsPage() {
  const [incomeStatement, setIncomeStatement] = useState<{
    income: ReportRow[];
    expenses: ReportRow[];
  } | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<{
    assets: ReportRow[];
    liabilities: ReportRow[];
    equity: ReportRow[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"income" | "balance">("income");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.incomeStatement(), api.balanceSheet()])
      .then(([is, bs]) => {
        setIncomeStatement(is);
        setBalanceSheet(bs);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-400 text-sm">Error: {error}</p>;
  if (!incomeStatement || !balanceSheet) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-96 rounded-xl" />
      </div>
    );
  }

  const ReportSection = ({
    title,
    rows,
    delay,
  }: {
    title: string;
    rows: ReportRow[];
    delay: number;
  }) => (
    <div className={`finance-card rounded-xl p-6 animate-fade-in-up stagger-${delay}`}>
      <h3
        className="text-base mb-4 text-gold"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h3>
      <table className="w-full finance-table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.account}>
              <td className="py-2.5 text-sm font-mono-numbers">{row.account}</td>
              <td className="py-2.5 text-right">
                <div className="flex justify-end gap-2">
                  {row.positions.map((p, i) => (
                    <CurrencyBadge key={i} currency={p.currency} amount={p.amount} size="sm" />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="animate-fade-in-up">
        <p className="text-[11px] text-[#52525b] uppercase tracking-[0.15em] mb-1">
          Finanzas
        </p>
        <h1
          className="text-3xl tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Reportes
        </h1>
      </div>

      {/* Custom Tab Switcher */}
      <div className="animate-fade-in-up stagger-1 flex gap-1 bg-[#111113] border border-white/[0.06] rounded-lg p-1 w-fit">
        {[
          { key: "income" as const, label: "Estado de Resultados" },
          { key: "balance" as const, label: "Balance General" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-[#c8a24e]/10 text-[#dbb668]"
                : "text-[#71717a] hover:text-[#a1a1aa]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "income" ? (
        <div className="space-y-4">
          <ReportSection title="Ingresos" rows={incomeStatement.income} delay={2} />
          <ReportSection title="Gastos" rows={incomeStatement.expenses} delay={3} />
        </div>
      ) : (
        <div className="space-y-4">
          <ReportSection title="Activos" rows={balanceSheet.assets} delay={2} />
          <ReportSection title="Pasivos" rows={balanceSheet.liabilities} delay={3} />
          <ReportSection title="Capital" rows={balanceSheet.equity} delay={4} />
        </div>
      )}
    </div>
  );
}
