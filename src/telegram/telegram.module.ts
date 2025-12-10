import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token:
        process.env.TELEGRAM_BOT_TOKEN ||
        '8363767647:AAHcHSk-mNyWyFbCoJVWXG8yDOMJxHp3BP0',
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [TelegramService],
})
export class TelegramModule {}
