const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface Posting {
  account: string;
  amount: string;
  currency: string;
}

export interface Transaction {
  date: string;
  payee: string;
  narration: string;
  postings: Posting[];
}

export interface AccountBalance {
  amount: string;
  currency: string;
}

export interface ReportRow {
  account: string;
  positions: AccountBalance[];
}

export interface DashboardData {
  balances: Record<string, AccountBalance[]>;
  recent_transactions: Transaction[];
  income_vs_expenses: {
    income: ReportRow[];
    expenses: ReportRow[];
  };
  pending_dividends: AccountBalance[];
}

export const api = {
  health: () => fetchAPI<{ status: string }>("/api/health"),
  accounts: () => fetchAPI<string[]>("/api/accounts"),
  balances: () => fetchAPI<Record<string, AccountBalance[]>>("/api/accounts/balances"),
  transactions: (limit = 100) => fetchAPI<Transaction[]>(`/api/transactions?limit=${limit}`),
  incomeStatement: (year?: number) =>
    fetchAPI<{ income: ReportRow[]; expenses: ReportRow[] }>(
      `/api/reports/income-statement${year ? `?year=${year}` : ""}`
    ),
  balanceSheet: () =>
    fetchAPI<{ assets: ReportRow[]; liabilities: ReportRow[]; equity: ReportRow[] }>(
      "/api/reports/balance-sheet"
    ),
  dashboard: () => fetchAPI<DashboardData>("/api/dashboard"),
};
