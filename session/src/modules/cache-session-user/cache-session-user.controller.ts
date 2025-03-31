import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Post,
} from '@nestjs/common';
import { redisConfig } from 'src/config/config.redis';
import Redis from 'ioredis';
import { 
    DeleteUserSessionRequest, 
    DeleteUserSessionResponse, 
    GetUserSessionResponse, 
    SaveUserSessionRequest, 
    SaveUserSessionResponse 
} from './dto';

@Controller('session')
export class SessionUserController {
    private redis: Redis;

    constructor() {
        this.redis = new Redis(redisConfig);
    }

    // ('SessionUserService', 'SaveUserSession')
    @Post('save')
    async SaveUserSession(
        @Body() data: SaveUserSessionRequest,
    ): Promise<SaveUserSessionResponse> {
        try {
            if (!data.userId) throw new BadRequestException('userId missing');
            await this.redis.set(data.userId.toString(), data.jwtToken);
            return { message: 'User session saved successfully' };
        } catch (error) {
            console.error('Error in SaveUserSession:', error);
            throw new InternalServerErrorException('Server have problem');
        }
    }

    // ('SessionUserService', 'GetUserSession')
    @Get('get')
    async GetUserSession(
        @Param('data') data: { userId: number; },
    ): Promise<GetUserSessionResponse> {
        try {
            if (!data.userId) throw new BadRequestException('userId missing');
            const token = await this.redis.get(data.userId.toString());
            if (!token) throw new BadRequestException('Token missing');
            return { userId: data.userId, jwtToken: token || '' };
        } catch (e) {
            throw new InternalServerErrorException('Server have problem');
        }
    }

    // ('SessionUserService', 'DeleteUserSession')
    @Post('del')
    async DeleteUserSession(
        @Body() data: DeleteUserSessionRequest,
    ): Promise<DeleteUserSessionResponse> {
        try {
            await this.redis.del(data.userId.toString());
            return {
                message: 'User session deleted successfully',
                status: 200,
            };
        } catch (error) {
            console.error('Error in DeleteUserSession:', error);
            throw new InternalServerErrorException('Server have problem');
        }
    }
}