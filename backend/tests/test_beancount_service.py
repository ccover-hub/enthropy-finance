import sys
from pathlib import Path

# Add backend to path so imports work
sys.path.insert(0, str(Path(__file__).parent.parent))

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
