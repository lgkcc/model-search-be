import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CookieService } from './cookie.service';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private cookieService: CookieService,
    private authService: AuthService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const accessToken: string = req.cookies[CookieService.accessKey];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const oldRefreshToken: string = req.cookies[CookieService.refreshKey];
    if (!accessToken && !oldRefreshToken) {
      throw new UnauthorizedException();
    }
    if (accessToken) {
      try {
        const sessionAccessInfo = await this.jwtService.verifyAsync<{
          id: string;
        }>(accessToken, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
        req['session'] = sessionAccessInfo;
      } catch {
        throw new UnauthorizedException();
      }
    }

    if (!accessToken && oldRefreshToken) {
      try {
        const sessionInfo = await this.jwtService.verifyAsync<{
          id: string;
        }>(oldRefreshToken, {
          secret: process.env.JWT_REFRESH_SECRET,
        });

        const user = await this.usersService.findById(sessionInfo.id, true);
        if (!user || !user.refreshToken) {
          throw new UnauthorizedException();
        }
        const isValidOldRefreshToken = await bcrypt.compare(
          oldRefreshToken,
          user.refreshToken,
        );
        if (!isValidOldRefreshToken) {
          throw new UnauthorizedException();
        }
        const userInfo = {
          id: sessionInfo.id,
        };
        const { accessToken, refreshToken } =
          await this.authService.generateTokens(userInfo);
        this.cookieService.setTokens(res, { accessToken, refreshToken });

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateRefreshTokenHash(
          userInfo.id,
          refreshTokenHash,
        );

        req['session'] = sessionInfo;
      } catch {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
