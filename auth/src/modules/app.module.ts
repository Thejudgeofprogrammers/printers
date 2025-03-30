import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CryptModule } from './crypt/crypt.module';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/main.config';

@Module({
  imports: [
    AuthModule,
    CryptModule,
    TokenModule,
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
