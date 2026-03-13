from fastapi import APIRouter, Query
from services.beancount_service import BeancountService
from config import LEDGER_PATH

router = APIRouter(prefix="/api/transactions", tags=["transactions"])
svc = BeancountService(str(LEDGER_PATH))


@router.get("")
def list_transactions(limit: int = Query(default=100, le=500)):
    return svc.get_transactions(limit=limit)
