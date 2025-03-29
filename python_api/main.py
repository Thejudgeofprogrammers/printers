import os
from dotenv import load_dotenv
from fastapi import FastAPI
from src.modules.printers.printer_controller import router
from src.modules.monitorin.monitoring_controller import router as router2

load_dotenv("./.env")
PORT = os.getenv('PORT_MOON')

app = FastAPI()

app.include_router(router)
app.include_router(router2)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run(app, host=host, port=port)

