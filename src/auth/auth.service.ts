import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signUpDto';
import { SignInDto } from './dto/signInDto';
import { PasswordService } from './password.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';
import { AdminSignUpDto } from './dto/adminSignUpDto';
import * as crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import type { Session } from '../common/types/types';
import { Role } from '../common/const/const';
import { DbService } from '../db/db.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  constructor(
    private passwordService: PasswordService,
    private dbService: DbService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Cron('* * 0 * * *')
  async deleteExpiredVerificationProcesses() {
    await this.dbService.telegramVerification.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
  }

  async generateTokens(sessionInfo: Session) {
    const accessToken = await this.jwtService.signAsync(sessionInfo, {
      expiresIn: '1d',
      secret: process.env.JWT_ACCESS_SECRET,
    });
    const refreshToken = await this.jwtService.signAsync(sessionInfo, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET,
    });
    return { accessToken, refreshToken };
  }

  async connectTelegram(userId: string) {
    const isExistVerificationProcess =
      await this.dbService.telegramVerification.findUnique({
        where: { userId },
      });
    if (
      isExistVerificationProcess &&
      isExistVerificationProcess.expiresAt > new Date()
    ) {
      throw new HttpException(
        'Verification process already exists',
        HttpStatus.FORBIDDEN,
      );
    }
    if (
      isExistVerificationProcess &&
      isExistVerificationProcess.expiresAt <= new Date()
    ) {
      await this.dbService.telegramVerification.delete({
        where: { userId },
      });
    }
    const verificationCode = crypto.randomBytes(24).toString('hex');
    await this.dbService.telegramVerification.create({
      data: {
        userId,
        verificationCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    return verificationCode;
  }

  async disconnectTelegram() {}

  async signIn(data: SignInDto) {
    const { login, password } = data;

    const lowercaseLogin = login.toLowerCase();
    const user = await this.usersService.findByLogin(lowercaseLogin, true);
    if (!user) {
      throw new HttpException(
        'Неверный логин или пароль',
        HttpStatus.FORBIDDEN,
      );
    }
    const isValidPassword = await this.passwordService.comparePassword(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new HttpException(
        'Неверный логин или пароль',
        HttpStatus.FORBIDDEN,
      );
    }

    const { accessToken, refreshToken } = await this.generateTokens({
      id: user.id,
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshTokenHash(user.id, refreshTokenHash);

    return { login, accessToken, refreshToken };
  }

  async signUp(data: SignUpDto | AdminSignUpDto) {
    const { login, password, profileName } = data;
    const lowercaseLogin = login.toLowerCase();
    const user = await this.usersService.findByLogin(lowercaseLogin);
    if (user) {
      throw new HttpException(
        'Пользователь с таким логином уже существует',
        HttpStatus.CONFLICT,
      );
    }
    const roles: Role[] = [Role.USER, Role.MODEL];
    if ('isAdmin' in data && data.isAdmin) {
      roles.push(Role.ADMIN);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const newUser = await this.usersService.createUser({
      password: hashedPassword,
      login: lowercaseLogin,
      roles,
      profileName,
    });
    const { accessToken, refreshToken } = await this.generateTokens({
      id: newUser.id,
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshTokenHash(
      newUser.id,
      refreshTokenHash,
    );
    return { login: newUser.login, accessToken, refreshToken };
  }

  async resetPassword(login: string) {
    const lowercaseLogin = login.toLowerCase();

    const randomPassword = crypto.randomBytes(16).toString('hex');

    const hashedPassword =
      await this.passwordService.hashPassword(randomPassword);

    await this.usersService.updatePassword({
      login: lowercaseLogin,
      newPassword: hashedPassword,
    });

    return randomPassword;
  }

  async changePassword({
    login,
    newPassword,
    oldPassword,
  }: {
    login: string;
    newPassword: string;
    oldPassword: string;
  }) {
    const lowercaseLogin = login.toLowerCase();
    const user = await this.usersService.findByLogin(lowercaseLogin, true);
    if (!user) {
      throw new HttpException(
        'Пользователь с таким логином не найден',
        HttpStatus.FORBIDDEN,
      );
    }

    const isValidPassword = await this.passwordService.comparePassword(
      oldPassword,
      user.password,
    );
    if (!isValidPassword) {
      throw new HttpException('Неверный пароль', HttpStatus.FORBIDDEN);
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);

    await this.usersService.updatePassword({
      login,
      newPassword: hashedPassword,
    });

    const { accessToken, refreshToken } = await this.generateTokens({
      id: user.id,
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshTokenHash(user.id, refreshTokenHash);

    return { accessToken, refreshToken };
  }

  async getSession(userId: string) {
    const user = await this.usersService.findById(userId, false);
    if (!user) {
      throw new HttpException(
        'Пользователь с таким логином не найден',
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }
  async getSessionByLogin(login: string) {
    const user = await this.usersService.findByLogin(login, false);
    if (!user) {
      throw new HttpException(
        'Пользователь с таким логином не найден',
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }

  async invalidateRefreshToken(userId: string) {
    await this.usersService.updateRefreshTokenHash(userId, null);
  }
}
