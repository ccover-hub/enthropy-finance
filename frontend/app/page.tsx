"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyBadge } from "@/components/currency-badge";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { BalanceChart } from "@/components/charts/balance-chart";
import { api, type DashboardData } from "@/lib/api";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return <p>Cargando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data.balances)
          .filter(([account]) => account.startsWith("Assets:Bank"))
          .map(([account, positions]) => (
            <Card key={account}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {account.replace("Assets:Bank:", "")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {positions.map((p, i) => (
                    <CurrencyBadge
                      key={i}
                      currency={p.currency}
                      amount={p.amount}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dividendos Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {data.pending_dividends.length > 0 ? (
                data.pending_dividends.map((p, i) => (
                  <CurrencyBadge key={i} currency={p.currency} amount={p.amount} />
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Sin pendientes</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos vs Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart
              income={data.income_vs_expenses.income}
              expenses={data.income_vs_expenses.expenses}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saldos por Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceChart balances={data.balances} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Fecha</th>
                  <th className="text-left py-2">Descripcion</th>
                  <th className="text-right py-2">Monto</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_transactions.map((txn, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{txn.date}</td>
                    <td className="py-2">
                      {txn.payee && <span className="font-medium">{txn.payee} - </span>}
                      {txn.narration}
                    </td>
                    <td className="py-2 text-right">
                      <div className="flex flex-col items-end gap-1">
                        {txn.postings
                          .filter((p) => !p.account.startsWith("Income:") && !p.account.startsWith("Expenses:"))
                          .map((p, j) => (
                            <CurrencyBadge key={j} currency={p.currency} amount={p.amount} />
                          ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
