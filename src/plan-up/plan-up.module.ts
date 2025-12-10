import { Module } from '@nestjs/common';
import { PlanUpService } from './plan-up.service';
import { PlanUpController } from './plan-up.controller';
import { ProfilesModule } from '../profiles/profiles.module';
import { DictionariesModule } from '../dictionaries/dictionaries.module';

@Module({
  imports: [ProfilesModule, DictionariesModule],
  providers: [PlanUpService],
  controllers: [PlanUpController],
})
export class PlanUpModule {}
