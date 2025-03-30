import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

@Injectable()
export class CryptService {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(
        password: string,
        hashPassword: string
    ) {
        return await bcrypt.compare(password, hashPassword);
    }
}
