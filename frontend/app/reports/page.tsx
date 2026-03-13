"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.incomeStatement(), api.balanceSheet()])
      .then(([is, bs]) => {
        setIncomeStatement(is);
        setBalanceSheet(bs);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!incomeStatement || !balanceSheet) return <p>Cargando...</p>;

  const ReportTable = ({ rows }: { rows: ReportRow[] }) => (
    <table className="w-full text-sm">
      <tbody>
        {rows.map((row) => (
          <tr key={row.account} className="border-b">
            <td className="py-2">{row.account}</td>
            <td className="py-2 text-right">
              <div className="flex justify-end gap-2">
                {row.positions.map((p, i) => (
                  <CurrencyBadge key={i} currency={p.currency} amount={p.amount} />
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reportes</h1>

      <Tabs defaultValue="income">
        <TabsList>
          <TabsTrigger value="income">Estado de Resultados</TabsTrigger>
          <TabsTrigger value="balance">Balance General</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTable rows={incomeStatement.income} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTable rows={incomeStatement.expenses} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTable rows={balanceSheet.assets} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pasivos</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTable rows={balanceSheet.liabilities} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Capital</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTable rows={balanceSheet.equity} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
