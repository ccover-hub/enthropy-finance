# Enthropy Finance Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a business finance app for Enthropy using Beancount + Fava as accounting engine and a custom Next.js dashboard with FastAPI backend.

**Architecture:** Beancount plain-text ledger files are the single source of truth. FastAPI reads/queries the ledger and exposes REST endpoints. Next.js frontend consumes the API to render a custom dashboard with charts, tables, and reports.

**Tech Stack:** Beancount 3, Fava, Python 3.12/FastAPI, Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Recharts, Docker Compose.

---

## File Structure

```
enthropy-finance/
├── ledger/
│   ├── main.beancount              # Main entry point, includes all other files
│   ├── accounts.beancount          # Chart of accounts definitions
│   ├── prices.beancount            # USD/MXN exchange rates
│   ├── dividends.beancount         # Dividend transactions
│   └── 2026/
│       ├── income.beancount        # Income transactions
│       ├── expenses.beancount      # Expense transactions
│       └── transfers.beancount     # Inter-account transfers
├── backend/
│   ├── requirements.txt            # Python dependencies
│   ├── main.py                     # FastAPI app entry point
│   ├── config.py                   # Configuration (ledger path, etc.)
│   ├── services/
│   │   └── beancount_service.py    # Beancount loader + query wrapper
│   ├── api/
│   │   ├── accounts.py             # /api/accounts endpoints
│   │   ├── transactions.py         # /api/transactions endpoints
│   │   ├── reports.py              # /api/reports endpoints (P&L, Balance)
│   │   └── dashboard.py            # /api/dashboard aggregated data
│   └── tests/
│       ├── test_beancount_service.py
│       ├── test_accounts_api.py
│       ├── test_transactions_api.py
│       ├── test_reports_api.py
│       └── test_dashboard_api.py
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── app/
│   │   ├── layout.tsx              # Root layout with sidebar nav
│   │   ├── page.tsx                # Dashboard home
│   │   ├── transactions/
│   │   │   └── page.tsx            # Transaction list with filters
│   │   ├── accounts/
│   │   │   └── page.tsx            # Account balances view
│   │   ├── reports/
│   │   │   └── page.tsx            # P&L, Balance Sheet
│   │   └── dividends/
│   │       └── page.tsx            # Dividend tracking
│   ├── components/
│   │   ├── sidebar.tsx             # Navigation sidebar
│   │   ├── currency-badge.tsx      # MXN/USD currency indicator
│   │   ├── charts/
│   │   │   ├── income-expense-chart.tsx
│   │   │   ├── balance-chart.tsx
│   │   │   └── currency-breakdown.tsx
│   │   └── ui/                     # shadcn/ui (auto-generated)
│   └── lib/
│       └── api.ts                  # API client helper
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── .gitignore
```

---

## Chunk 1: Beancount Ledger Setup

### Task 1: Initialize project and create .gitignore

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Create .gitignore**

```
# Python
__pycache__/
*.py[cod]
*.egg-info/
.venv/
venv/
dist/
build/

# Node
node_modules/
.next/
frontend/.next/
frontend/node_modules/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add .gitignore"
```

---

### Task 2: Create Beancount chart of accounts

**Files:**
- Create: `ledger/accounts.beancount`

- [ ] **Step 1: Create accounts file**

```beancount
; Enthropy Finance - Chart of Accounts
; Software Development & Consulting Company
; Operations in Mexico (MXN) and United States (USD)

; === Operating Currencies ===
option "operating_currency" "USD"
option "operating_currency" "MXN"

; === Assets ===
2026-01-01 open Assets:Bank:MX:Checking                MXN
2026-01-01 open Assets:Bank:US:Checking                USD
2026-01-01 open Assets:AccountsReceivable:MX           MXN
2026-01-01 open Assets:AccountsReceivable:US           USD

; === Liabilities ===
2026-01-01 open Liabilities:Dividends:Pending          USD,MXN
2026-01-01 open Liabilities:Taxes:MX                   MXN
2026-01-01 open Liabilities:Taxes:US                   USD
2026-01-01 open Liabilities:CreditCard:MX              MXN
2026-01-01 open Liabilities:CreditCard:US              USD

; === Income ===
2026-01-01 open Income:Consulting                      USD,MXN
2026-01-01 open Income:Development                     USD,MXN
2026-01-01 open Income:Other                           USD,MXN

; === Expenses ===
2026-01-01 open Expenses:Salaries                      USD,MXN
2026-01-01 open Expenses:Software                      USD,MXN
2026-01-01 open Expenses:Office                        USD,MXN
2026-01-01 open Expenses:Taxes:MX                      MXN
2026-01-01 open Expenses:Taxes:US                      USD
2026-01-01 open Expenses:Deductions                    USD,MXN
2026-01-01 open Expenses:Banking:Fees                  USD,MXN
2026-01-01 open Expenses:Travel                        USD,MXN
2026-01-01 open Expenses:Marketing                     USD,MXN
2026-01-01 open Expenses:Legal                         USD,MXN
2026-01-01 open Expenses:Insurance                     USD,MXN

; === Equity ===
2026-01-01 open Equity:Opening-Balances
2026-01-01 open Equity:Dividends:Paid                  USD,MXN
2026-01-01 open Equity:Retained-Earnings               USD,MXN
```

- [ ] **Step 2: Verify file parses**

Run: `bean-check ledger/accounts.beancount`
Expected: No output (no errors)

- [ ] **Step 3: Commit**

```bash
git add ledger/accounts.beancount
git commit -m "feat: add chart of accounts for Enthropy"
```

---

### Task 3: Create main ledger, prices, and sample transactions

**Files:**
- Create: `ledger/main.beancount`
- Create: `ledger/prices.beancount`
- Create: `ledger/dividends.beancount`
- Create: `ledger/2026/income.beancount`
- Create: `ledger/2026/expenses.beancount`
- Create: `ledger/2026/transfers.beancount`

- [ ] **Step 1: Create main.beancount**

```beancount
; Enthropy Finance - Main Ledger
; This file includes all other ledger files.

option "title" "Enthropy Finance"
option "operating_currency" "USD"
option "operating_currency" "MXN"

include "accounts.beancount"
include "prices.beancount"
include "dividends.beancount"
include "2026/income.beancount"
include "2026/expenses.beancount"
include "2026/transfers.beancount"
```

- [ ] **Step 2: Create prices.beancount with sample exchange rates**

```beancount
; USD/MXN Exchange Rates

2026-01-01 price USD 17.10 MXN
2026-02-01 price USD 17.25 MXN
2026-03-01 price USD 17.15 MXN
```

- [ ] **Step 3: Create sample income transactions**

```beancount
; 2026 Income Transactions

2026-01-15 * "Client Alpha" "Consulting services - January"
  Assets:Bank:US:Checking           5000.00 USD
  Income:Consulting                -5000.00 USD

2026-01-20 * "Cliente Beta" "Desarrollo de software - Enero"
  Assets:Bank:MX:Checking         85000.00 MXN
  Income:Development             -85000.00 MXN

2026-02-15 * "Client Alpha" "Consulting services - February"
  Assets:Bank:US:Checking           5000.00 USD
  Income:Consulting                -5000.00 USD

2026-02-20 * "Cliente Beta" "Desarrollo de software - Febrero"
  Assets:Bank:MX:Checking         85000.00 MXN
  Income:Development             -85000.00 MXN

2026-03-01 * "Client Gamma" "Software project milestone 1"
  Assets:AccountsReceivable:US     12000.00 USD
  Income:Development              -12000.00 USD
```

- [ ] **Step 4: Create sample expense transactions**

```beancount
; 2026 Expense Transactions

2026-01-05 * "GitHub" "GitHub Team subscription"
  Expenses:Software                44.00 USD
  Assets:Bank:US:Checking         -44.00 USD

2026-01-10 * "AWS" "Cloud hosting - January"
  Expenses:Software               150.00 USD
  Assets:Bank:US:Checking        -150.00 USD

2026-01-15 * "WeWork" "Renta oficina - Enero"
  Expenses:Office               15000.00 MXN
  Assets:Bank:MX:Checking     -15000.00 MXN

2026-01-31 * "Nomina" "Salarios - Enero"
  Expenses:Salaries             45000.00 MXN
  Assets:Bank:MX:Checking     -45000.00 MXN

2026-02-05 * "GitHub" "GitHub Team subscription"
  Expenses:Software                44.00 USD
  Assets:Bank:US:Checking         -44.00 USD

2026-02-10 * "AWS" "Cloud hosting - February"
  Expenses:Software               150.00 USD
  Assets:Bank:US:Checking        -150.00 USD

2026-02-15 * "WeWork" "Renta oficina - Febrero"
  Expenses:Office               15000.00 MXN
  Assets:Bank:MX:Checking     -15000.00 MXN

2026-02-28 * "Nomina" "Salarios - Febrero"
  Expenses:Salaries             45000.00 MXN
  Assets:Bank:MX:Checking     -45000.00 MXN
```

- [ ] **Step 5: Create sample transfers**

```beancount
; 2026 Inter-account Transfers

2026-01-25 * "Transfer" "USD to MXN for operations"
  Assets:Bank:MX:Checking         34200.00 MXN
  Assets:Bank:US:Checking         -2000.00 USD @@ 34200.00 MXN
```

- [ ] **Step 6: Create dividends file**

```beancount
; Dividend Transactions

2026-02-01 * "Dividendo Q4 2025" "Dividendo pendiente para socios"
  Expenses:Deductions              3000.00 USD
  Liabilities:Dividends:Pending   -3000.00 USD

2026-03-01 * "Pago dividendo" "Pago parcial dividendo Q4 2025"
  Liabilities:Dividends:Pending    1000.00 USD
  Assets:Bank:US:Checking         -1000.00 USD
```

- [ ] **Step 7: Verify full ledger parses**

Run: `cd ledger && bean-check main.beancount`
Expected: No output (no errors)

- [ ] **Step 8: Test Fava works**

Run: `fava ledger/main.beancount --port 5000 &` then open http://localhost:5000
Expected: Fava UI loads with accounts and transactions visible
Kill: `kill %1`

- [ ] **Step 9: Commit**

```bash
git add ledger/
git commit -m "feat: add complete ledger with sample data, prices, and dividends"
```

---

## Chunk 2: FastAPI Backend

### Task 4: Set up FastAPI project with dependencies

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/config.py`
- Create: `backend/main.py`

- [ ] **Step 1: Create requirements.txt**

```
fastapi==0.115.0
uvicorn[standard]==0.30.0
beancount>=3.0
beanquery>=0.2
python-dateutil>=2.8
```

- [ ] **Step 2: Create config.py**

```python
from pathlib import Path

LEDGER_PATH = Path(__file__).parent.parent / "ledger" / "main.beancount"
API_HOST = "0.0.0.0"
API_PORT = 8000
CORS_ORIGINS = ["http://localhost:3000"]
```

- [ ] **Step 3: Create main.py**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS

app = FastAPI(title="Enthropy Finance API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}
```

- [ ] **Step 4: Install dependencies and verify server starts**

Run:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 &
curl http://localhost:8000/api/health
kill %1
```
Expected: `{"status":"ok"}`

- [ ] **Step 5: Commit**

```bash
git add backend/requirements.txt backend/config.py backend/main.py
git commit -m "feat: set up FastAPI backend with health endpoint"
```

---

### Task 5: Create Beancount service layer

**Files:**
- Create: `backend/services/__init__.py`
- Create: `backend/services/beancount_service.py`
- Create: `backend/tests/__init__.py`
- Create: `backend/tests/test_beancount_service.py`

- [ ] **Step 1: Write failing tests**

```python
# backend/tests/test_beancount_service.py
import pytest
from services.beancount_service import BeancountService
from config import LEDGER_PATH


@pytest.fixture
def svc():
    return BeancountService(str(LEDGER_PATH))


def test_load_ledger(svc):
    entries, errors, options = svc.load()
    assert len(errors) == 0
    assert len(entries) > 0
    assert options["title"] == "Enthropy Finance"


def test_get_accounts(svc):
    accounts = svc.get_accounts()
    assert "Assets:Bank:MX:Checking" in accounts
    assert "Assets:Bank:US:Checking" in accounts


def test_get_account_balances(svc):
    balances = svc.get_account_balances()
    assert isinstance(balances, dict)
    assert "Assets:Bank:MX:Checking" in balances


def test_get_transactions(svc):
    txns = svc.get_transactions()
    assert len(txns) > 0
    assert "date" in txns[0]
    assert "narration" in txns[0]
    assert "postings" in txns[0]


def test_get_income_statement(svc):
    result = svc.get_income_statement()
    assert "income" in result
    assert "expenses" in result


def test_get_balance_sheet(svc):
    result = svc.get_balance_sheet()
    assert "assets" in result
    assert "liabilities" in result
    assert "equity" in result
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && python -m pytest tests/test_beancount_service.py -v`
Expected: FAIL (import error, module not found)

- [ ] **Step 3: Implement BeancountService**

```python
# backend/services/__init__.py
# (empty)
```

```python
# backend/services/beancount_service.py
from decimal import Decimal
from beancount import loader
from beancount.core import data
from beanquery import query


class BeancountService:
    def __init__(self, ledger_path: str):
        self.ledger_path = ledger_path
        self._entries = None
        self._errors = None
        self._options = None

    def load(self):
        self._entries, self._errors, self._options = loader.load_file(
            self.ledger_path
        )
        return self._entries, self._errors, self._options

    def _ensure_loaded(self):
        if self._entries is None:
            self.load()

    def get_accounts(self) -> list[str]:
        self._ensure_loaded()
        return sorted(
            {
                entry.account
                for entry in self._entries
                if isinstance(entry, data.Open)
            }
        )

    def get_account_balances(self) -> dict:
        self._ensure_loaded()
        result_types, result_rows = query.run_query(
            self._entries,
            self._options,
            "SELECT account, sum(position) as total "
            "WHERE account ~ '^Assets' OR account ~ '^Liabilities' "
            "GROUP BY account ORDER BY account",
        )
        balances = {}
        for row in result_rows:
            account = row[0]
            inventory = row[1]
            positions = []
            for pos in inventory:
                positions.append(
                    {
                        "amount": str(pos.units.number),
                        "currency": pos.units.currency,
                    }
                )
            balances[account] = positions
        return balances

    def get_transactions(self, limit: int = 100) -> list[dict]:
        self._ensure_loaded()
        txns = [e for e in self._entries if isinstance(e, data.Transaction)]
        txns = sorted(txns, key=lambda t: t.date, reverse=True)[:limit]
        result = []
        for txn in txns:
            postings = []
            for p in txn.postings:
                postings.append(
                    {
                        "account": p.account,
                        "amount": str(p.units.number),
                        "currency": p.units.currency,
                    }
                )
            result.append(
                {
                    "date": txn.date.isoformat(),
                    "payee": txn.payee or "",
                    "narration": txn.narration or "",
                    "postings": postings,
                }
            )
        return result

    def get_income_statement(self, year: int = None) -> dict:
        self._ensure_loaded()
        where_clause = ""
        if year:
            where_clause = f" AND year = {year}"

        income_types, income_rows = query.run_query(
            self._entries,
            self._options,
            f"SELECT account, sum(position) as total "
            f"WHERE account ~ '^Income'{where_clause} "
            f"GROUP BY account ORDER BY account",
        )
        expense_types, expense_rows = query.run_query(
            self._entries,
            self._options,
            f"SELECT account, sum(position) as total "
            f"WHERE account ~ '^Expenses'{where_clause} "
            f"GROUP BY account ORDER BY account",
        )
        return {
            "income": self._rows_to_dict(income_rows),
            "expenses": self._rows_to_dict(expense_rows),
        }

    def get_balance_sheet(self) -> dict:
        self._ensure_loaded()
        categories = {
            "assets": "^Assets",
            "liabilities": "^Liabilities",
            "equity": "^Equity",
        }
        result = {}
        for key, pattern in categories.items():
            _, rows = query.run_query(
                self._entries,
                self._options,
                f"SELECT account, sum(position) as total "
                f"WHERE account ~ '{pattern}' "
                f"GROUP BY account ORDER BY account",
            )
            result[key] = self._rows_to_dict(rows)
        return result

    def _rows_to_dict(self, rows) -> list[dict]:
        result = []
        for row in rows:
            account = row[0]
            inventory = row[1]
            positions = []
            for pos in inventory:
                positions.append(
                    {
                        "amount": str(pos.units.number),
                        "currency": pos.units.currency,
                    }
                )
            result.append({"account": account, "positions": positions})
        return result
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd backend && python -m pytest tests/test_beancount_service.py -v`
Expected: All 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add backend/services/ backend/tests/
git commit -m "feat: add Beancount service layer with queries"
```

---

### Task 6: Create API endpoints

**Files:**
- Create: `backend/api/__init__.py`
- Create: `backend/api/accounts.py`
- Create: `backend/api/transactions.py`
- Create: `backend/api/reports.py`
- Create: `backend/api/dashboard.py`
- Create: `backend/tests/test_accounts_api.py`
- Modify: `backend/main.py` (add router includes)

- [ ] **Step 1: Write failing test for accounts API**

```python
# backend/tests/test_accounts_api.py
import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_list_accounts(client):
    resp = client.get("/api/accounts")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert any("Bank:MX" in a for a in data)


def test_account_balances(client):
    resp = client.get("/api/accounts/balances")
    assert resp.status_code == 200
    data = resp.json()
    assert "Assets:Bank:MX:Checking" in data


def test_transactions(client):
    resp = client.get("/api/transactions")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) > 0


def test_income_statement(client):
    resp = client.get("/api/reports/income-statement")
    assert resp.status_code == 200
    data = resp.json()
    assert "income" in data
    assert "expenses" in data


def test_balance_sheet(client):
    resp = client.get("/api/reports/balance-sheet")
    assert resp.status_code == 200
    data = resp.json()
    assert "assets" in data


def test_dashboard(client):
    resp = client.get("/api/dashboard")
    assert resp.status_code == 200
    data = resp.json()
    assert "balances" in data
    assert "recent_transactions" in data
    assert "income_vs_expenses" in data
    assert "pending_dividends" in data
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && python -m pytest tests/test_accounts_api.py -v`
Expected: FAIL (404, routes not found)

- [ ] **Step 3: Implement API routers**

```python
# backend/api/__init__.py
# (empty)
```

```python
# backend/api/accounts.py
from fastapi import APIRouter
from services.beancount_service import BeancountService
from config import LEDGER_PATH

router = APIRouter(prefix="/api/accounts", tags=["accounts"])
svc = BeancountService(str(LEDGER_PATH))


@router.get("")
def list_accounts():
    return svc.get_accounts()


@router.get("/balances")
def account_balances():
    return svc.get_account_balances()
```

```python
# backend/api/transactions.py
from fastapi import APIRouter, Query
from services.beancount_service import BeancountService
from config import LEDGER_PATH

router = APIRouter(prefix="/api/transactions", tags=["transactions"])
svc = BeancountService(str(LEDGER_PATH))


@router.get("")
def list_transactions(limit: int = Query(default=100, le=500)):
    return svc.get_transactions(limit=limit)
```

```python
# backend/api/reports.py
from fastapi import APIRouter, Query
from services.beancount_service import BeancountService
from config import LEDGER_PATH

router = APIRouter(prefix="/api/reports", tags=["reports"])
svc = BeancountService(str(LEDGER_PATH))


@router.get("/income-statement")
def income_statement(year: int = Query(default=None)):
    return svc.get_income_statement(year=year)


@router.get("/balance-sheet")
def balance_sheet():
    return svc.get_balance_sheet()
```

```python
# backend/api/dashboard.py
from fastapi import APIRouter
from services.beancount_service import BeancountService
from config import LEDGER_PATH

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])
svc = BeancountService(str(LEDGER_PATH))


@router.get("")
def dashboard():
    balances = svc.get_account_balances()
    transactions = svc.get_transactions(limit=10)
    income_statement = svc.get_income_statement()

    # Extract pending dividends
    pending_dividends = balances.get("Liabilities:Dividends:Pending", [])

    return {
        "balances": balances,
        "recent_transactions": transactions,
        "income_vs_expenses": income_statement,
        "pending_dividends": pending_dividends,
    }
```

- [ ] **Step 4: Update main.py to include routers**

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS
from api.accounts import router as accounts_router
from api.transactions import router as transactions_router
from api.reports import router as reports_router
from api.dashboard import router as dashboard_router

app = FastAPI(title="Enthropy Finance API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts_router)
app.include_router(transactions_router)
app.include_router(reports_router)
app.include_router(dashboard_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
```

- [ ] **Step 5: Run all tests**

Run: `cd backend && python -m pytest tests/ -v`
Expected: All tests PASS

- [ ] **Step 6: Commit**

```bash
git add backend/api/ backend/tests/test_accounts_api.py backend/main.py
git commit -m "feat: add REST API endpoints for accounts, transactions, reports, dashboard"
```

---

## Chunk 3: Next.js Frontend

### Task 7: Initialize Next.js project

**Files:**
- Create: `frontend/` (via create-next-app)

- [ ] **Step 1: Create Next.js app**

Run:
```bash
cd /path/to/enthropy-finance
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --no-turbopack
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
cd frontend
npm install recharts lucide-react
npx shadcn@latest init -d
npx shadcn@latest add card table badge button separator tabs
```

- [ ] **Step 3: Commit**

```bash
git add frontend/
git commit -m "feat: initialize Next.js frontend with shadcn/ui and recharts"
```

---

### Task 8: Create API client and layout

**Files:**
- Create: `frontend/lib/api.ts`
- Modify: `frontend/app/layout.tsx`
- Create: `frontend/components/sidebar.tsx`
- Create: `frontend/components/currency-badge.tsx`

- [ ] **Step 1: Create API client**

```typescript
// frontend/lib/api.ts
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
```

- [ ] **Step 2: Create sidebar component**

```tsx
// frontend/components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  FileText,
  CircleDollarSign,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transacciones", icon: ArrowLeftRight },
  { href: "/accounts", label: "Cuentas", icon: Wallet },
  { href: "/reports", label: "Reportes", icon: FileText },
  { href: "/dividends", label: "Dividendos", icon: CircleDollarSign },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Enthropy Finance</h1>
        <p className="text-sm text-muted-foreground">Control financiero</p>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-gray-200 dark:bg-gray-800 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 3: Create currency badge component**

```tsx
// frontend/components/currency-badge.tsx
import { Badge } from "@/components/ui/badge";

interface CurrencyBadgeProps {
  currency: string;
  amount: string;
}

export function CurrencyBadge({ currency, amount }: CurrencyBadgeProps) {
  const formatted = new Intl.NumberFormat(
    currency === "MXN" ? "es-MX" : "en-US",
    { style: "currency", currency }
  ).format(parseFloat(amount));

  return (
    <Badge variant={currency === "USD" ? "default" : "secondary"}>
      {formatted}
    </Badge>
  );
}
```

- [ ] **Step 4: Update root layout**

```tsx
// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enthropy Finance",
  description: "Business finance dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/lib/api.ts frontend/components/ frontend/app/layout.tsx
git commit -m "feat: add layout with sidebar, API client, and currency badge"
```

---

### Task 9: Build dashboard page

**Files:**
- Modify: `frontend/app/page.tsx`
- Create: `frontend/components/charts/income-expense-chart.tsx`
- Create: `frontend/components/charts/balance-chart.tsx`

- [ ] **Step 1: Create income vs expense chart**

```tsx
// frontend/components/charts/income-expense-chart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
        <Bar dataKey="amount" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Create balance chart**

```tsx
// frontend/components/charts/balance-chart.tsx
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
          label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
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
```

- [ ] **Step 3: Build dashboard page**

```tsx
// frontend/app/page.tsx
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

      {/* Account Balances */}
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

        {/* Pending Dividends */}
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

      {/* Charts */}
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

      {/* Recent Transactions */}
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
```

- [ ] **Step 4: Commit**

```bash
git add frontend/app/page.tsx frontend/components/charts/
git commit -m "feat: build dashboard with balance cards, charts, and recent transactions"
```

---

### Task 10: Build transactions page

**Files:**
- Create: `frontend/app/transactions/page.tsx`

- [ ] **Step 1: Create transactions page**

```tsx
// frontend/app/transactions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/transactions/
git commit -m "feat: add transactions page with filtering"
```

---

### Task 11: Build accounts, reports, and dividends pages

**Files:**
- Create: `frontend/app/accounts/page.tsx`
- Create: `frontend/app/reports/page.tsx`
- Create: `frontend/app/dividends/page.tsx`

- [ ] **Step 1: Create accounts page**

```tsx
// frontend/app/accounts/page.tsx
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
```

- [ ] **Step 2: Create reports page**

```tsx
// frontend/app/reports/page.tsx
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
```

- [ ] **Step 3: Create dividends page**

```tsx
// frontend/app/dividends/page.tsx
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
```

- [ ] **Step 4: Commit**

```bash
git add frontend/app/accounts/ frontend/app/reports/ frontend/app/dividends/
git commit -m "feat: add accounts, reports, and dividends pages"
```

---

## Chunk 4: Docker & Final Integration

### Task 12: Create Docker configuration

**Files:**
- Create: `Dockerfile.backend`
- Create: `Dockerfile.frontend`
- Create: `docker-compose.yml`

- [ ] **Step 1: Create backend Dockerfile**

```dockerfile
# Dockerfile.backend
FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY ledger/ /app/ledger/

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 2: Create frontend Dockerfile**

```dockerfile
# Dockerfile.frontend
FROM node:22-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

- [ ] **Step 3: Create docker-compose.yml**

```yaml
version: "3.8"

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    volumes:
      - ./ledger:/app/ledger
    environment:
      - LEDGER_PATH=/app/ledger/main.beancount

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend

  fava:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    volumes:
      - ./ledger:/app/ledger
    command: fava /app/ledger/main.beancount --host 0.0.0.0 --port 5000
```

- [ ] **Step 4: Verify docker-compose builds**

Run: `docker-compose build`
Expected: All three services build successfully

- [ ] **Step 5: Commit**

```bash
git add Dockerfile.backend Dockerfile.frontend docker-compose.yml
git commit -m "feat: add Docker configuration for all services"
```

---

### Task 13: Create .env.example and update config for env vars

**Files:**
- Create: `.env.example`
- Modify: `backend/config.py`
- Create: `frontend/.env.local`

- [ ] **Step 1: Create .env.example**

```
# Backend
LEDGER_PATH=./ledger/main.beancount
API_HOST=0.0.0.0
API_PORT=8000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- [ ] **Step 2: Update backend config to use env vars**

```python
# backend/config.py
import os
from pathlib import Path

LEDGER_PATH = Path(
    os.getenv("LEDGER_PATH", str(Path(__file__).parent.parent / "ledger" / "main.beancount"))
)
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
```

- [ ] **Step 3: Create frontend .env.local**

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- [ ] **Step 4: Commit**

```bash
git add .env.example backend/config.py frontend/.env.local
git commit -m "feat: add environment variable configuration"
```

---

### Task 14: Final integration test

- [ ] **Step 1: Start backend**

Run:
```bash
cd backend && uvicorn main:app --port 8000 &
```

- [ ] **Step 2: Test all API endpoints**

Run:
```bash
curl -s http://localhost:8000/api/health | python3 -m json.tool
curl -s http://localhost:8000/api/accounts | python3 -m json.tool
curl -s http://localhost:8000/api/accounts/balances | python3 -m json.tool
curl -s http://localhost:8000/api/transactions | python3 -m json.tool
curl -s http://localhost:8000/api/reports/income-statement | python3 -m json.tool
curl -s http://localhost:8000/api/reports/balance-sheet | python3 -m json.tool
curl -s http://localhost:8000/api/dashboard | python3 -m json.tool
```
Expected: All return valid JSON with data

- [ ] **Step 3: Start frontend**

Run:
```bash
cd frontend && npm run dev &
```

- [ ] **Step 4: Verify frontend loads**

Open http://localhost:3000 — dashboard should display with:
- Balance cards for MX and US accounts
- Income vs Expenses chart
- Balance pie chart
- Recent transactions table

- [ ] **Step 5: Kill processes and final commit**

```bash
kill %1 %2
git add -A
git commit -m "chore: final integration verification"
```
