from fastapi import APIRouter, Depends
from src.modules.monitorin.monitoring_service import MonitoringService

router = APIRouter()

@router.get("/logs")
async def get_logs(monitoring_service: MonitoringService = Depends()):
    data = await monitoring_service.get_logs()
    return { 
        "message": { 
            "memory": data[0],
            "cpu": data[1],
            "disk": data[2],
            "server_status": data[3]
        } 
    }