import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { ProfilesModule } from './profiles/profiles.module';
import { ImagesModule } from './images/images.module';
import { FilesModule } from './files/files.module';
import { PlanUpModule } from './plan-up/plan-up.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ReviewModule } from './review/review.module';
import { TelegramModule } from './telegram/telegram.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    DbModule,
    AuthModule,
    ProfilesModule,
    ImagesModule,
    FilesModule,
    PlanUpModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 100 }] }),
    ReviewModule,
    TelegramModule,
    DictionariesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
