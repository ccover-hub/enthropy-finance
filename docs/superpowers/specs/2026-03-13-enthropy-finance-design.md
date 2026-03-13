# Enthropy Finance - Design Spec

## Overview

Business finance application for Enthropy, a software development and consulting company operating in Mexico (MXN) and the United States (USD). Uses Beancount as the accounting engine with Fava as a backup UI, and a custom dashboard built with Next.js + FastAPI.

## Problem

Enthropy has no centralized financial control. They need to track:
- Income from consulting and software development
- Expenses across two countries
- Bank accounts in MX (MXN) and US (USD)
- Pending and paid dividends
- Deductions and subtractions
- Accounts receivable

## Architecture

```
enthropy-finance/
├── ledger/                    # Beancount (accounting data)
│   ├── main.beancount         # Main file (includes)
│   ├── accounts.beancount     # Chart of accounts
│   ├── 2026/                  # Transactions by year
│   │   ├── income.beancount
│   │   ├── expenses.beancount
│   │   └── transfers.beancount
│   ├── prices.beancount       # Exchange rates USD/MXN
│   └── dividends.beancount    # Pending/paid dividends
├── backend/                   # FastAPI - API over Beancount
│   ├── main.py
│   ├── api/
│   │   ├── accounts.py        # Account endpoints
│   │   ├── transactions.py    # Transaction CRUD
│   │   ├── reports.py         # P&L, Balance Sheet, Cash Flow
│   │   └── dashboard.py       # Aggregated dashboard data
│   └── services/
│       └── beancount.py       # Wrapper for beancount loader + beanquery
├── frontend/                  # Next.js - Custom dashboard
│   ├── app/
│   │   ├── page.tsx           # Main dashboard
│   │   ├── transactions/      # Transaction views
│   │   ├── accounts/          # Account views
│   │   ├── reports/           # Financial reports
│   │   └── dividends/         # Dividend tracking
│   └── components/
│       ├── charts/            # Charts (Recharts)
│       └── ui/                # shadcn/ui components
├── docker-compose.yml
└── README.md
```

## Chart of Accounts

```
Assets:
  Assets:Bank:MX:Checking          (MXN)
  Assets:Bank:US:Checking          (USD)
  Assets:AccountsReceivable        (USD/MXN)

Liabilities:
  Liabilities:Dividends:Pending    (dividends payable)
  Liabilities:Taxes:MX
  Liabilities:Taxes:US

Income:
  Income:Consulting                (consulting services)
  Income:Development               (software development)

Expenses:
  Expenses:Salaries
  Expenses:Software                (tools, licenses)
  Expenses:Office
  Expenses:Taxes
  Expenses:Deductions

Equity:
  Equity:Opening-Balances
  Equity:Dividends:Paid
```

## Stack

| Layer | Technology |
|-------|-----------|
| Accounting engine | Beancount 3 + Fava |
| Backend API | Python 3.12+ / FastAPI |
| Frontend | Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Containerization | Docker Compose |

## Key Features

### Dashboard
- Account balances summary (MXN + USD)
- Monthly income vs expenses
- Pending dividends overview
- Recent transactions

### Transactions
- Filterable table by account, date, currency
- Add new transactions (writes to .beancount files)

### Reports
- Profit & Loss statement
- Balance Sheet
- Cash Flow

### Dividends
- Pending vs paid tracking
- Dividend history

## Multi-Currency

- MXN and USD as primary currencies
- Exchange rates tracked in prices.beancount
- bean-price for automatic rate fetching
- Dashboard shows both currency totals

## Data Flow

1. Beancount `.beancount` files are the single source of truth
2. FastAPI backend reads/parses ledger via `beancount.loader`
3. Queries run via `beanquery` for reports and aggregations
4. Next.js frontend consumes REST API endpoints
5. Fava available on port 5000 as alternative/backup UI
