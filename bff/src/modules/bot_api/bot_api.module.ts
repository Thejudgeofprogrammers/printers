import { Module } from '@nestjs/common';
import { BotApiService } from './bot_api.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramUpdate } from './bot_api.update';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
            }),
        }),
    ],
    providers: [BotApiService, TelegramUpdate],
})
export class BotApiModule {}
