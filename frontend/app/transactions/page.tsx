"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyBadge } from "@/components/currency-badge";
import { api, type Transaction } from "@/lib/api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .transactions(500)
      .then(setTransactions)
      .catch((e) => setError(e.message));
  }, []);

  const filtered = transactions.filter(
    (txn) =>
      txn.payee.toLowerCase().includes(filter.toLowerCase()) ||
      txn.narration.toLowerCase().includes(filter.toLowerCase()) ||
      txn.postings.some((p) => p.account.toLowerCase().includes(filter.toLowerCase()))
  );

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transacciones</h1>

      <input
        type="text"
        placeholder="Filtrar por nombre, descripcion o cuenta..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full max-w-md px-4 py-2 border rounded-md"
      />

      <Card>
        <CardContent className="pt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Fecha</th>
                <th className="text-left py-2">Pagador</th>
                <th className="text-left py-2">Descripcion</th>
                <th className="text-left py-2">Cuentas</th>
                <th className="text-right py-2">Montos</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-2">{txn.date}</td>
                  <td className="py-2 font-medium">{txn.payee}</td>
                  <td className="py-2">{txn.narration}</td>
                  <td className="py-2">
                    {txn.postings.map((p, j) => (
                      <div key={j} className="text-xs text-muted-foreground">
                        {p.account}
                      </div>
                    ))}
                  </td>
                  <td className="py-2 text-right">
                    {txn.postings.map((p, j) => (
                      <div key={j}>
                        <CurrencyBadge currency={p.currency} amount={p.amount} />
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
