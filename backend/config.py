from pathlib import Path

LEDGER_PATH = Path(__file__).parent.parent / "ledger" / "main.beancount"
API_HOST = "0.0.0.0"
API_PORT = 8000
CORS_ORIGINS = ["http://localhost:3000"]
