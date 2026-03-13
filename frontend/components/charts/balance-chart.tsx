"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { AccountBalance } from "@/lib/api";

interface Props {
  balances: Record<string, AccountBalance[]>;
}

const COLORS = ["#c8a24e", "#34d399", "#60a5fa", "#a78bfa"];

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
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          dataKey="value"
          stroke="none"
          paddingAngle={2}
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.85}
            />
          ))}
        </Pie>
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
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
