import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { DictionariesModule } from '../dictionaries/dictionaries.module';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [DictionariesModule, ImagesModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
