import requests
import subprocess

class MonitoringService:
    async def get_logs(self):
        try:
            cpu = subprocess.run("top -bn1 | grep 'Cpu'", shell=True, capture_output=True, text=True, check=True)
            mem = subprocess.run(["free", "-m"], capture_output=True, text=True, check=True)
            disk = subprocess.run(["df", "-h"], capture_output=True, text=True, check=True)
            server_status = False
            response = requests.get('http://localhost:3001/ping')
            if response.text == 'pong':
                server_status = True
                
            return [cpu.stdout, mem.stdout, disk.stdout, server_status]
        except:
            print('Ошибка get_logs')