import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateNewUserResponse,
    FindUserByEmailResponse,
    FindUserByIdResponse,
    GetPasswordUserResponse,
    UpdateUserPasswordResponse,
} from './dto';
import { CreateNewUserRequest } from '../prisma/dto';

@Controller('user')
export class UserController {
    constructor(private readonly prismaService: PrismaService) {}

    @Post('update_password/:id')
    async UpdateUserPassword(
        @Body() payload: {
            userId: number,
            password: string
        }
    ): Promise<UpdateUserPasswordResponse> {
        try {
            const { userId, password } = payload;
            if (!password || !userId) {
                throw new InternalServerErrorException(
                    'Ошибка при передаче данных',
                );
            }

            const toHashPassword = await this.prismaService.updateUserPassword({
                userId,
                password,
            });

            if (!toHashPassword) {
                throw new InternalServerErrorException(
                    'Ошибка сервера при сохранении нового пароля',
                );
            }

            return {
                message: toHashPassword.message,
                status: toHashPassword.status,
            };
        } catch (e) {
            throw new InternalServerErrorException(
                e,
            );
        }
    }

    @Get('password')
    async GetPasswordUser(
        @Param('id') id: number,
    ): Promise<GetPasswordUserResponse> {
        try {
            if (!id) {
                throw new InternalServerErrorException(
                    'Не вся информация получена',
                );
            }

            const existUser = await this.prismaService.findUserById(
                id,
            );

            if (!existUser) {
                throw new NotFoundException('User not Found');
            }

            return { hashedPassword: existUser.password_hash };
        } catch (e) {
            throw new InternalServerErrorException(
                e,
            );
        }
    }

    @Post('create')
    async CreateNewUser(
        @Body() request: CreateNewUserRequest,
    ): Promise<CreateNewUserResponse> {
        try {
            if (
                !request.username ||
                !request.email ||
                !request.passwordHash
            ) {
                throw new InternalServerErrorException(
                    'All fields are required',
                );
            }

            const existingUserByEmail =
                await this.prismaService.findUserByEmail(request.email);

            if (existingUserByEmail) {
                throw new InternalServerErrorException('Email already in use');
            }

            const newUser = await this.prismaService.createUser(request);

            if (!newUser) {
                throw new InternalServerErrorException('User is not created');
            }

            return { info: { message: 'User created', status: 201 } };
        } catch (e) {
            console.error('Error in CreateNewUser:', e);
            throw new InternalServerErrorException(
                'Server encountered an issue',
            );
        }
    }

    @Post('id/:id')
    async FindUserById(
        @Param('id') id: number,
    ): Promise<FindUserByIdResponse> {
        try {
            const existUser = await this.prismaService.findUserById(id);

            if (!existUser) {
                return {
                    notFound: {
                        message: 'User not found',
                        status: 404,
                    },
                };
            }

            return {
                userData: {
                    userId: existUser.user_id,
                    email: existUser.email,
                    passwordHash: existUser.password_hash,
                    username: existUser.username,
                },
            };
        } catch (e) {
            console.error('Error in CreateNewUser:', e);
            throw new InternalServerErrorException(
                'Server encountered an issue',
            );
        }
    }

    @Get('email/:email')
    async FindUserByEmail(
        @Param('email') email: string,
    ): Promise<FindUserByEmailResponse> {
        try {
            const existUser = await this.prismaService.findUserByEmail(email);

            if (!existUser) {
                return {
                    notFound: {
                        message: 'User not found',
                        status: 404,
                    },
                };
            }

            return {
                userData: {
                    userId: existUser.user_id,
                    email: existUser.email,
                    passwordHash: existUser.password_hash,
                    username: existUser.username,
                },
            };
        } catch (e) {
            console.error('Error in FindUserByEmail:', e);
            throw new InternalServerErrorException('Server error occurred');
        }
    }
}
