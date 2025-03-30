import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { CreateNewUserRequest, UpdateUserPasswordRequest, UpdateUserPasswordResponse } from './dto';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super();
    }

    async findUserByEmail(email: string): Promise<User> {
        try {
            return await this.user.findUnique({ where: { email } });
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new InternalServerErrorException(
                'Unable to find user by email',
            );
        }
    }

    async createUser(data: CreateNewUserRequest): Promise<User> {
        try {
            const userData = await this.user.create({
                data: {
                    username: data.username,
                    email: data.email,
                    password_hash: data.passwordHash,
                },
            });

            return userData;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new InternalServerErrorException('Unable to create user');
        }
    }

    async updateUserPassword(
        data: UpdateUserPasswordRequest,
    ): Promise<UpdateUserPasswordResponse> {
        try {
            const { password, userId } = data;

            const user = await this.user.findUnique({
                where: { user_id: userId },
            });

            if (!user) {
                throw new NotFoundException('Пользователь не найден');
            }

            const updatedUser = await this.user.update({
                where: { user_id: userId },
                data: { password_hash: password },
            });

            if (!updatedUser) {
                throw new InternalServerErrorException(
                    'Ошибка при смене пароля',
                );
            }

            return {
                message: 'Пользователь успешно изменил пароль',
                status: 200,
            };
        } catch (e) {
            console.error('Error creating user:', e);
            throw new InternalServerErrorException('Unable to update user');
        }
    }

    async findUserById(user_id: number): Promise<User> {
        try {
            return await this.user.findUnique({ where: { user_id } });
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw new InternalServerErrorException('Unable to find user by ID');
        }
    }
}
