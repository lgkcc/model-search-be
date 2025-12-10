import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DbService } from '../db/db.service';
import { ProfilesService } from '../profiles/profiles.service';
import { PriceService } from '../dictionaries/price.service';
import * as process from 'node:process';

@Injectable()
export class PlanUpService {
  constructor(
    private dbService: DbService,
    private priceService: PriceService,
    private profilesService: ProfilesService,
  ) {}
  @Cron('* 0 * * * *')
  async handlePlanUp() {
    const planUps = await this.dbService.planUp.findMany({
      where: { time: { lte: new Date() } },
    });
    await Promise.all(
      planUps.map(async (planUp) => {
        await this.dbService.planUp.delete({ where: { id: planUp.id } });
        await this.profilesService.upProfileByProfileId({
          profileId: planUp.profileId,
        });
      }),
    );
  }

  async createPlanUp(profileId: string, time: string) {
    const key = process.env.UP_PRICE ?? 'UP_PRICE';
    const cost = await this.priceService.getPriceByKey(key);
    //TODO Делать запрос из модуля профилей
    const profile = await this.dbService.profile.findUnique({
      where: { id: profileId },
    });
    if (!profile) {
      throw new UnauthorizedException();
    }
    if (profile.balance < cost) {
      throw new BadRequestException();
    }

    await this.profilesService.changeProfileBalance({
      profileId: profile.id,
      balance: -cost,
    });
    await this.dbService.planUp.create({
      data: {
        profileId: profile.id,
        time,
        cost,
      },
    });
  }

  async deletePlanUp(profileId: string, planUpId: string) {
    const profile = await this.dbService.profile.findUnique({
      where: { id: profileId },
    });
    if (!profile) {
      throw new UnauthorizedException();
    }
    const planUp = await this.dbService.planUp.findUnique({
      where: { id: planUpId },
    });
    if (!planUp) {
      throw new BadRequestException();
    }
    if (planUp.profileId !== profile.id) {
      throw new ForbiddenException();
    }

    await this.dbService.planUp.delete({ where: { id: planUpId } });
    await this.profilesService.changeProfileBalance({
      profileId: profile.id,
      balance: planUp.cost,
    });
  }
}
