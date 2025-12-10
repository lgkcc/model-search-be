import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { TRole } from '../common/types/types';

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}

  async connectTelegram(userId: string, telegramId: string) {
    const user = await this.findById(userId);
    if (!user) {
      return { status: false, message: 'User not found' };
    }
    if (user.telegramId) {
      return { status: false, message: 'User already has a telegram id' };
    }
    const userByTgId = await this.getUserByTelegramId(telegramId);
    if (userByTgId) {
      return { status: false, message: 'Telegram id already in use' };
    }
    await this.dbService.user.update({
      where: { id: userId },
      data: { telegramId },
    });
    return { status: true, message: 'Telegram id connected' };
  }

  async disconnectTelegram(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.telegramId) {
      throw new ForbiddenException('User does not have a telegram id');
    }
    await this.dbService.user.update({
      where: { id: userId },
      data: { telegramId: null },
    });
  }

  async getUserByTelegramId(telegramId: string) {
    return this.dbService.user.findUnique({
      where: { telegramId },
      omit: { password: true, refreshToken: true },
    });
  }

  async getAll() {
    return this.dbService.user.findMany({
      omit: { password: true, refreshToken: true },
      include: { profile: true },
    });
  }
  async findByLogin(login: string, includeAuthData = false) {
    return this.dbService.user.findUnique({
      where: { login },
      omit: includeAuthData
        ? { createdAt: true, updatedAt: true }
        : {
            password: true,
            refreshToken: true,
            createdAt: true,
            updatedAt: true,
          },
    });
  }
  async findById(id: string, includeAuthData = false) {
    return this.dbService.user.findUnique({
      where: { id },
      omit: includeAuthData
        ? { createdAt: true, updatedAt: true }
        : {
            password: true,
            refreshToken: true,
            createdAt: true,
            updatedAt: true,
          },
    });
  }
  async createUser(data: {
    login: string;
    password: string;
    roles: TRole[];
    profileName: string;
  }) {
    return this.dbService.user.create({
      data: {
        login: data.login,
        password: data.password,
        roles: data.roles,
        profile: { create: { profileName: data.profileName } },
      },
    });
  }
  async updatePassword({
    login,
    newPassword,
  }: {
    login: string;
    newPassword: string;
  }) {
    return this.dbService.user.update({
      where: { login: login },
      data: { password: newPassword },
    });
  }
  async deleteUser(id: string) {
    await this.dbService.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
  async recoveryUser(id: string) {
    await this.dbService.user.update({
      where: { id },
      data: { isDeleted: false },
    });
  }

  async updateRefreshTokenHash(userId: string, hash: string | null) {
    return this.dbService.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }
}
