import { Module } from '@nestjs/common';
import { SessionUserController } from './cache-session-user.controller';


@Module({
    controllers: [SessionUserController],
})
export class SessionUserModule {}