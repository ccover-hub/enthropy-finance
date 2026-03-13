"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { AccountBalance } from "@/lib/api";

interface Props {
  balances: Record<string, AccountBalance[]>;
}

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export function BalanceChart({ balances }: Props) {
  const data = Object.entries(balances)
    .filter(([account]) => account.startsWith("Assets:Bank"))
    .flatMap(([account, positions]) =>
      positions.map((p) => ({
        name: `${account.split(":").pop()} (${p.currency})`,
        value: Math.abs(parseFloat(p.amount)),
      }))
    );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          label={({ name, value }: { name: string; value: number }) => `${name}: $${value.toLocaleString()}`}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
