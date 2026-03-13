"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyBadge } from "@/components/currency-badge";
import { api, type Transaction, type AccountBalance } from "@/lib/api";

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
            txn.postings.some((p) =>
              p.account.includes("Dividend")
            )
          )
        );
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  const pending = balances["Liabilities:Dividends:Pending"] || [];
  const paid = balances["Equity:Dividends:Paid"] || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dividendos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            {pending.length > 0 ? (
              <div className="flex gap-2">
                {pending.map((p, i) => (
                  <CurrencyBadge key={i} currency={p.currency} amount={p.amount} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Sin dividendos pendientes</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pagados</CardTitle>
          </CardHeader>
          <CardContent>
            {paid.length > 0 ? (
              <div className="flex gap-2">
                {paid.map((p, i) => (
                  <CurrencyBadge key={i} currency={p.currency} amount={p.amount} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Sin dividendos pagados</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Dividendos</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Fecha</th>
                <th className="text-left py-2">Descripcion</th>
                <th className="text-right py-2">Monto</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{txn.date}</td>
                  <td className="py-2">
                    {txn.payee && <span className="font-medium">{txn.payee} - </span>}
                    {txn.narration}
                  </td>
                  <td className="py-2 text-right">
                    {txn.postings
                      .filter((p) => p.account.includes("Dividend"))
                      .map((p, j) => (
                        <CurrencyBadge key={j} currency={p.currency} amount={p.amount} />
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
