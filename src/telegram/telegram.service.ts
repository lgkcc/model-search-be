import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { Start, Update, Command } from 'nestjs-telegraf';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/common/decorators/public.decorator';
import { DbService } from '../db/db.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

@SkipThrottle()
@Public()
@Update()
@Injectable()
export class TelegramService {
  constructor(
    private dbService: DbService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Command('reset')
  async resetPassword(ctx: Context) {
    if (!ctx.chat?.id) return;
    const user = await this.usersService.getUserByTelegramId(
      String(ctx.chat.id),
    );
    if (!user) {
      return;
    }
    const password = await this.authService.resetPassword(user.login);
    await ctx.reply(
      `Пароль успешно сброшен \nНовый пароль - \`${password}\` (Нажмите на пароль, чтобы скопировать)`,
      {
        parse_mode: 'Markdown',
      },
    );
  }

  @Start()
  async startCommand(ctx: Context) {
    if (!ctx.chat?.id) return;
    //@ts-ignore
    const code = ctx.startPayload as string;
    const user = await this.usersService.getUserByTelegramId(
      String(ctx.chat.id),
    );
    if (user) {
      await ctx.reply('Здравствуйте! Вы уже подключили свой Telegram аккаунт.');
      return;
    }
    if (!code) {
      await ctx.reply('Здравствуйте! Вы можете подключить Telegram аккаунт.');
      return;
    }
    const isExistVerificationProcess =
      await this.dbService.telegramVerification.findUnique({
        where: { verificationCode: code },
      });
    if (!isExistVerificationProcess) {
      await ctx.reply(
        'Произошла ошибка при подключении аккаунта, попробуйте снова',
      );
      return;
    }
    if (
      isExistVerificationProcess &&
      isExistVerificationProcess.expiresAt <= new Date()
    ) {
      await this.dbService.telegramVerification.delete({
        where: { verificationCode: code },
      });
      await ctx.reply('Время на подключение истекло, попробуйте снова');
      return;
    }

    const res = await this.usersService.connectTelegram(
      isExistVerificationProcess.userId,
      String(ctx.chat.id),
    );
    await this.dbService.telegramVerification.delete({
      where: { verificationCode: code },
    });
    if (res.status) {
      await ctx.reply('Telegram аккаунт успешно привязан!');
    } else {
      if (res.message === 'User not found') {
        await ctx.reply(
          'Произошла ошибка при подключении аккаунта, попробуйте снова',
        );
        return;
      }
      if (res.message === 'User already has a telegram id') {
        await ctx.reply(
          'Произошла ошибка при подключении аккаунта, данный аккаунт уже привязан к другому Telegram id',
        );
        return;
      }
      if (res.message === 'Telegram id already in use') {
        await ctx.reply(
          'Произошла ошибка при подключении аккаунта, данный Telegram аккаунт уже привязан к другому пользователю',
        );
        return;
      }
    }
  }
}
