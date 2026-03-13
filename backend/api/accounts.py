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
