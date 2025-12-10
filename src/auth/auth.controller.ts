import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signInDto';
import type { Response } from 'express';
import { SignUpDto } from './dto/signUpDto';
import { CookieService } from './cookie.service';
import { SessionInfo } from '../common/decorators/session-info.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { ChangePasswordByLoginDto } from './dto/changePasswordByLoginDto';
import { AdminSignUpDto } from './dto/adminSignUpDto';
import { Throttle } from '@nestjs/throttler';
import type { Session } from '../common/types/types';
import { Role } from '../common/const/const';

@Throttle({ default: { ttl: 90000, limit: 44 } })
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private cookieService: CookieService,
  ) {}

  @Get('/telegram-connect')
  @HttpCode(HttpStatus.ACCEPTED)
  async telegramConnect(@SessionInfo() session: Session) {
    return await this.authService.connectTelegram(session.id);
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.ACCEPTED)
  @Public()
  async signIn(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { login, accessToken, refreshToken } =
      await this.authService.signIn(data);
    this.cookieService.setTokens(res, { accessToken, refreshToken });
    return this.authService.getSessionByLogin(login);
  }

  @Post('/sign-up')
  @Public()
  async signUp(
    @Body() body: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { login, accessToken, refreshToken } = await this.authService.signUp({
      password: body.password,
      login: body.login,
      profileName: body.profileName,
    });
    this.cookieService.setTokens(res, { accessToken, refreshToken });
    return this.authService.getSessionByLogin(login);
  }

  @Post('/admin-sign-up')
  @Roles(Role.ADMIN)
  async adminSignUp(@Body() body: AdminSignUpDto) {
    await this.authService.signUp({
      password: body.password,
      login: body.login,
      profileName: body.profileName,
      isAdmin: body.isAdmin,
    });
    return;
  }

  @Get('/sign-out')
  async signOut(
    @SessionInfo() session: Session,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.invalidateRefreshToken(session.id);
    this.cookieService.removeToken(res);
  }

  @Throttle({ default: { ttl: 90000, limit: 60 } })
  @Get('/session')
  getSessionInfo(@SessionInfo() session: Session) {
    console.log(session);
    return this.authService.getSession(session.id);
  }

  @Get('/reset-password/:login')
  @Roles(Role.ADMIN)
  async resetPasswordByLogin(@Param('login') login: string) {
    return this.authService.resetPassword(login);
  }

  @Post('/change-password')
  @Roles(Role.ADMIN, Role.USER, Role.MODEL)
  async changePasswordByLogin(
    @Res({ passthrough: true }) res: Response,
    @Body() body: ChangePasswordByLoginDto,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.changePassword(body);
    this.cookieService.setTokens(res, { accessToken, refreshToken });
    return;
  }
}
