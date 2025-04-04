import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CryptService } from '../crypt/crypt.service';
import { ToHashPasswordRequest, ToHashPasswordResponse } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly cryptService: CryptService,
    ) {}

    async ToHashPassword(
        payload: ToHashPasswordRequest,
    ): Promise<ToHashPasswordResponse> {
        try {
            if (!payload.password) {
                throw new InternalServerErrorException('Ошибка сервера');
            }

            const hashedPassword = await this.cryptService.hashPassword(
                payload.password,
            );

            return { hashedPassword };
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
