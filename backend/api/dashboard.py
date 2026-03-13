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

    pending_dividends = balances.get("Liabilities:Dividends:Pending", [])

    return {
        "balances": balances,
        "recent_transactions": transactions,
        "income_vs_expenses": income_statement,
        "pending_dividends": pending_dividends,
    }
