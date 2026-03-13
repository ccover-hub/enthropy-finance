import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

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
