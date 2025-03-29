import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotApiService {
    constructor(
        @InjectBot() private bot: Telegraf,
        private configService: ConfigService,
    ) {}

    async sendMessage(chatId: number, message: string) {
        try {
            return await this.bot.telegram.sendMessage(chatId, message);
        } catch (error) {
            console.error(`Ошибка при отправке сообщения:`, error);
        }
    }

    async getLogs() {
        try {
            const PORT_PY = this.configService.get<string>('PORT_PY');
            const HOST_PY = this.configService.get<string>('HOST_PY');
            const response = await axios.get<{
                message: {
                    memory: string;
                    server_status: boolean;
                    cpu: string;
                };
            }>(`http://${HOST_PY}:${PORT_PY}/logs`);
            return (
                response.data.message.memory +
                '\n' +
                response.data.message.cpu +
                '\n' +
                'server_status: ' +
                response.data.message.server_status
            );
        } catch (e) {
            console.error('Ошибка getLogs');
        }
    }

    async getPersent(ip: string): Promise<any> {
        try {
            const PORT_PY = this.configService.get<string>('PORT_PY');
            const HOST_PY = this.configService.get<string>('HOST_PY');
            const res: any = await axios.post(
                `http://${HOST_PY}:${PORT_PY}/websocket`,
                {
                    ip,
                },
            );

            return JSON.parse(res.data);
        } catch (e) {
            console.error('Ошибка getPersent');
        }
    }
}
