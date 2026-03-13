#!/usr/bin/env python3
"""Export Beancount ledger data to JSON files for static frontend deployment."""

import json
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from services.beancount_service import BeancountService

LEDGER_PATH = Path(__file__).parent.parent / "ledger" / "main.beancount"
OUTPUT_DIR = Path(__file__).parent.parent / "frontend" / "public" / "data"


def export():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    svc = BeancountService(str(LEDGER_PATH))
    svc.load()

    # Export accounts
    accounts = svc.get_accounts()
    with open(OUTPUT_DIR / "accounts.json", "w") as f:
        json.dump(accounts, f, indent=2)

    # Export balances
    balances = svc.get_account_balances()
    with open(OUTPUT_DIR / "balances.json", "w") as f:
        json.dump(balances, f, indent=2)

    # Export transactions
    transactions = svc.get_transactions(limit=500)
    with open(OUTPUT_DIR / "transactions.json", "w") as f:
        json.dump(transactions, f, indent=2)

    # Export income statement
    income_statement = svc.get_income_statement()
    with open(OUTPUT_DIR / "income-statement.json", "w") as f:
        json.dump(income_statement, f, indent=2)

    # Export balance sheet
    balance_sheet = svc.get_balance_sheet()
    with open(OUTPUT_DIR / "balance-sheet.json", "w") as f:
        json.dump(balance_sheet, f, indent=2)

    # Export dashboard (combined)
    pending_dividends = balances.get("Liabilities:Dividends:Pending", [])
    dashboard = {
        "balances": balances,
        "recent_transactions": svc.get_transactions(limit=10),
        "income_vs_expenses": income_statement,
        "pending_dividends": pending_dividends,
    }
    with open(OUTPUT_DIR / "dashboard.json", "w") as f:
        json.dump(dashboard, f, indent=2)

    print(f"Exported data to {OUTPUT_DIR}")
    for f in sorted(OUTPUT_DIR.glob("*.json")):
        print(f"  {f.name} ({f.stat().st_size} bytes)")


if __name__ == "__main__":
    export()
