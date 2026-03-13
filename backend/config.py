import os
from pathlib import Path

LEDGER_PATH = Path(
    os.getenv("LEDGER_PATH", str(Path(__file__).parent.parent / "ledger" / "main.beancount"))
)
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
