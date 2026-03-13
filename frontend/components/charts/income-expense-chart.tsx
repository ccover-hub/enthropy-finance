"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ReportRow } from "@/lib/api";

interface Props {
  income: ReportRow[];
  expenses: ReportRow[];
}

export function IncomeExpenseChart({ income, expenses }: Props) {
  const totalIncome = income.reduce(
    (sum, row) =>
      sum + row.positions.reduce((s, p) => s + Math.abs(parseFloat(p.amount)), 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, row) =>
      sum + row.positions.reduce((s, p) => s + parseFloat(p.amount), 0),
    0
  );

  const data = [
    { name: "Ingresos", amount: totalIncome },
    { name: "Gastos", amount: totalExpenses },
  ];

  const colors = ["#34d399", "#f87171"];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barSize={48}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#71717a", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#52525b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "#1a1a1d",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            color: "#fafafa",
            fontSize: "13px",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [`$${Number(value).toLocaleString()}`, ""]}
          cursor={{ fill: "rgba(255,255,255,0.02)" }}
        />
        <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index]} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
