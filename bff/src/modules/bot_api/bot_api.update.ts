import { Update, Start, On, Hears } from 'nestjs-telegraf';
import { BotApiService } from './bot_api.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';

@Update()
export class TelegramUpdate {
    constructor(
        private readonly botApiService: BotApiService,
        private configService: ConfigService,
    ) {}
    @Start()
    async onStart(ctx: any) {
        await ctx.reply('Привет, я бот Артём');
    }

    @Hears('hello')
    async onHello(ctx: any) {
        console.log(ctx.from);
        await ctx.reply(ctx.from.username);
    }

    @On('text')
    async onText(ctx: any) {
        try {
            if (ctx.message.text === '/logs') {
                const data = await this.botApiService.getLogs();
                await ctx.reply(data);
            } else if (/^\/ip\d+$/.test(ctx.message.text)) {
                const ipNumber = ctx.message.text.replace('/ip', '');
                const x = this.configService.get<string>(
                    `HOST_MOON_${ipNumber}`,
                );

                const parsedData = await this.botApiService.getPersent(x);

                if (parsedData === null) {
                    await ctx.reply('Принтер завершил работу');
                } else {
                    const messageText =
                        `Выполнено: ${parsedData.success}%\n` +
                        `Время окончания: ${parsedData.date_end}\n` +
                        `Осталось: ${parsedData.estimated_time}\n` +
                        `IP: ${x}`;

                    const imageUrl = `http://${x}/timelapse/timelapse.jpg?cacheBust=${new Date().getTime()}`;
                    try {
                        const response: any = await axios.get(imageUrl, {
                            responseType: 'arraybuffer',
                        });

                        if (response.status === 200 && response.data) {
                            fs.writeFileSync('/tmp/photo.jpg', response.data);

                            await ctx.replyWithPhoto(
                                { source: '/tmp/photo.jpg' },
                                {
                                    caption:
                                        parsedData.success > 100
                                            ? 'Принтер завершил работу'
                                            : messageText,
                                },
                            );
                        } else {
                            throw new Error(
                                'Пустой ответ или ошибка загрузки фото',
                            );
                        }
                    } catch (photoError) {
                        console.warn(
                            'Фото недоступно, отправляю только текст:',
                            photoError.message,
                        );
                        if (parsedData.success > 100) {
                            await ctx.reply('Принтер завершил работу');
                        } else {
                            await ctx.reply(messageText);
                        }
                    }
                }
            } else {
                await ctx.reply(`Ты написал: ${ctx.message.text}`);
            }
        } catch (error) {
            console.error('Ошибка при отправке фото:', error);
            await ctx.reply('Не удалось загрузить информацию');
        }
    }
}
