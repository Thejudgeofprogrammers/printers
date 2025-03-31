import { BadRequestException, Controller, Get, InternalServerErrorException, Post, UnauthorizedException } from '@nestjs/common';
import { CryptService } from '../crypt/crypt.service';
import { TokenService } from '../token/token.service';
import { 
    CheckPasswordRequest, 
    CheckPasswordResponse, 
    LoginRequest, 
    LoginResponse, 
    RegisterRequest, 
    RegisterResponse
} from './dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly cryptService: CryptService,
        private readonly tokenService: TokenService,
    ) {}

    @Get('check')
    async CheckPassword(
        payload: CheckPasswordRequest,
    ): Promise<CheckPasswordResponse> {
        try {
            if (!payload.hashedPassword || !payload.password) {
                throw new BadRequestException('Data without');
            }

            const booleanAnswer = await this.cryptService.comparePassword(
                payload.password,
                payload.hashedPassword,
            );

            return { exist: booleanAnswer };
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    @Post('register')
    async Register(data: RegisterRequest): Promise<RegisterResponse> {
        try {
            if (!data.email && !data.password)
                throw new BadRequestException();

            const hashedPassword = await this.cryptService.hashPassword(
                data.password,
            );

            return {
                username: data.username,
                email: data.email,
                passwordHash: hashedPassword,
            };
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    @Post('login')
    async Login(data: LoginRequest): Promise<LoginResponse> {
        try {
            const { email, password, passwordHash, userId } = data;

            const checkUser = await this.cryptService.comparePassword(
                password,
                passwordHash,
            );

            if (checkUser) {
                const jwtToken = await this.tokenService.generateToken({
                    userId: userId,
                    email: email,
                });

                const userSessia = {
                    userId: userId,
                    jwtToken: jwtToken,
                };

                return userSessia;
            } else {
                throw new UnauthorizedException();
            }
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
