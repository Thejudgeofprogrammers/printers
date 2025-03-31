import { Module } from '@nestjs/common';
import configuration from '../config/config.main';
import { ConfigModule } from '@nestjs/config';
import { SessionUserModule } from './cache-session-user/cache-session-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      load: [configuration],
    }),
    SessionUserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
