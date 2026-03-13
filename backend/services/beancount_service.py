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
