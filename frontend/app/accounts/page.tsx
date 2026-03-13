"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyBadge } from "@/components/currency-badge";
import { api, type AccountBalance } from "@/lib/api";

export default function AccountsPage() {
  const [balances, setBalances] = useState<Record<string, AccountBalance[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.balances().then(setBalances).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  const groups = {
    Assets: Object.entries(balances).filter(([a]) => a.startsWith("Assets:")),
    Liabilities: Object.entries(balances).filter(([a]) => a.startsWith("Liabilities:")),
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cuentas</h1>
      {Object.entries(groups).map(([group, accounts]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle>{group}</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Cuenta</th>
                  <th className="text-right py-2">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(([account, positions]) => (
                  <tr key={account} className="border-b">
                    <td className="py-2">{account}</td>
                    <td className="py-2 text-right">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
