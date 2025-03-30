import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from '../token/token.module';
import { CryptModule } from '../crypt/crypt.module';

@Module({
  imports: [CryptModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
