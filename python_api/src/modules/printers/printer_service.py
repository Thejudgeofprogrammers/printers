import os
import datetime
import requests
PORT = 7125

class PrinterService:
    async def get_printer(self, ip: str):
        try:
            parsed_info = requests.get(f'http://{ip}:{PORT}/printer/objects/query?print_stats')
            
            if parsed_info.status_code != 200:
                return 'Ошибка в нахождении файла'
            
            decoded_filename = parsed_info.json()['result']['status']['print_stats'].get('filename')
            parsed_ans = requests.get(f'http://{ip}:{PORT}/server/files/metadata?filename={decoded_filename}')
            
            if parsed_ans.status_code != 200:
                return 'Ошибка в парсинге файла'
            
            estimated_time = parsed_ans.json()['result'].get('estimated_time')
            print_start_time = parsed_ans.json()['result'].get('print_start_time')
            cur_date = datetime.datetime.now().timestamp()
            
            persent = float(((float(cur_date) - float(print_start_time))) / float(estimated_time)) * 100
            
            time_str = str(datetime.timedelta(seconds=print_start_time + estimated_time - cur_date))
            
            utc_time = datetime.datetime.utcfromtimestamp(print_start_time + estimated_time + 3600 * int(os.getenv('UTC_FORMAT')))
            
            if persent != '' or persent < 100: 
                return {"success": format(persent, '.2f'), "date_end": str(utc_time)[:-7], "estimated_time": time_str[:-7]}
            else:
                return {"success": '', "date_end": '', "estimated_time": ''}
        except:
            print('Ошибка в get_printer')