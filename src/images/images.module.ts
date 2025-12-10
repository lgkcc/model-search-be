import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
