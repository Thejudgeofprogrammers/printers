import json
from fastapi import APIRouter, Depends
from src.modules.printers.dto.index import IPRequest
from src.modules.printers.printer_service import PrinterService

router = APIRouter()

@router.post('/websocket')
async def calculate_print_percentage(
    ip_request: IPRequest,
    printer_service: PrinterService = Depends()
):
    object_to_send = await printer_service.get_printer(ip=ip_request.ip)
    return json.dumps(object_to_send)