import { Controller } from '@nestjs/common';
import { CryptService } from '../crypt/crypt.service';
import { TokenService } from '../token/token.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly cryptService: CryptService,
        private readonly tokenService: TokenService,
    ) {}
}
