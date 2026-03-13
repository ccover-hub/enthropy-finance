"use client";

import { useEffect, useState } from "react";
import { CurrencyBadge } from "@/components/currency-badge";
import { api, type Transaction } from "@/lib/api";
import { Search } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.transactions(500).then(setTransactions).catch((e) => setError(e.message));
  }, []);

  const filtered = transactions.filter(
    (txn) =>
      txn.payee.toLowerCase().includes(filter.toLowerCase()) ||
      txn.narration.toLowerCase().includes(filter.toLowerCase()) ||
      txn.postings.some((p) =>
        p.account.toLowerCase().includes(filter.toLowerCase())
      )
  );

  if (error) return <p className="text-red-400 text-sm">Error: {error}</p>;

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="animate-fade-in-up">
        <p className="text-[11px] text-[#52525b] uppercase tracking-[0.15em] mb-1">
          Registro
        </p>
        <h1
          className="text-3xl tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Transacciones
        </h1>
      </div>

      {/* Search */}
      <div className="animate-fade-in-up stagger-1 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
        <input
          type="text"
          placeholder="Buscar transacciones..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#111113] border border-white/[0.06] rounded-lg text-sm text-[#fafafa] placeholder-[#52525b] focus:outline-none focus:border-[#c8a24e]/30 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="finance-card rounded-xl p-6 animate-fade-in-up stagger-2">
        <table className="w-full finance-table">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-3 pr-4">Fecha</th>
              <th className="text-left py-3 pr-4">Pagador</th>
              <th className="text-left py-3 pr-4">Descripcion</th>
              <th className="text-left py-3 pr-4">Cuentas</th>
              <th className="text-right py-3">Montos</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn, i) => (
              <tr key={i}>
                <td className="py-3 pr-4 font-mono-numbers text-[#71717a] text-sm whitespace-nowrap">
                  {txn.date}
                </td>
                <td className="py-3 pr-4 text-sm font-medium">{txn.payee}</td>
                <td className="py-3 pr-4 text-sm text-[#71717a]">
                  {txn.narration}
                </td>
                <td className="py-3 pr-4">
                  {txn.postings.map((p, j) => (
                    <div key={j} className="text-[11px] text-[#52525b] font-mono-numbers">
                      {p.account}
                    </div>
                  ))}
                </td>
                <td className="py-3 text-right">
                  {txn.postings.map((p, j) => (
                    <div key={j} className="mb-0.5">
                      <CurrencyBadge
                        currency={p.currency}
                        amount={p.amount}
                        size="sm"
                      />
                    </div>
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
