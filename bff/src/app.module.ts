import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BotApiModule } from './modules/bot_api/bot_api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        BotApiModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [AppController],
})
export class AppModule {}
