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
