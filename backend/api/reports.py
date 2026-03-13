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
