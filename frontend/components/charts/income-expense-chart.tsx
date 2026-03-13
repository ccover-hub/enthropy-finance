"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ReportRow } from "@/lib/api";

interface Props {
  income: ReportRow[];
  expenses: ReportRow[];
}

export function IncomeExpenseChart({ income, expenses }: Props) {
  const totalIncome = income.reduce((sum, row) => {
    return (
      sum +
      row.positions.reduce(
        (s, p) => s + Math.abs(parseFloat(p.amount)),
        0
      )
    );
  }, 0);

  const totalExpenses = expenses.reduce((sum, row) => {
    return (
      sum +
      row.positions.reduce((s, p) => s + parseFloat(p.amount), 0)
    );
  }, 0);

  const data = [
    { name: "Ingresos", amount: totalIncome, fill: "#22c55e" },
    { name: "Gastos", amount: totalExpenses, fill: "#ef4444" },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
        <Bar dataKey="amount" />
      </BarChart>
    </ResponsiveContainer>
  );
}
