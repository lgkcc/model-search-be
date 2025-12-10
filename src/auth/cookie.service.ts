import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  static accessKey = 'access_token';
  static refreshKey = 'refresh_token';

  setTokens(
    res: Response,
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string },
  ) {
    res.cookie(CookieService.accessKey, accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      // sameSite: 'lax',
      path: '/',
    });
    res.cookie(CookieService.refreshKey, refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 * 30,
      // sameSite: 'lax',
      path: '/',
    });
  }

  removeToken(res: Response) {
    res.clearCookie(CookieService.accessKey);
    res.clearCookie(CookieService.refreshKey);
  }
}
