import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UpProfileBalanceDto } from './dto/upProfileBalanceDto';
import { ChangeProfileDescriptionDto } from './dto/changeProfileDescriptionDto';
import { ChangeProfileNameDto } from './dto/changeProfileNameDto';
import { ChangeProfileMainDataDto } from './dto/changeProfileMainDataDto';
import { FreezeProfileDto } from './dto/freezeProfileDto';
import { UnFreezeProfileDto } from './dto/unFreezeProfileDto';
import { Role } from '../common/const/const';
import { SessionInfo } from '../common/decorators/session-info.decorator';
import type { Session } from '../common/types/types';
import { UsersService } from '../users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';

//CHECK LIST
// Change profile name - ready
// Change profile description - ready
// Change profile balance - ready
// Change profile currencies - ready
// Freeze profile - ready
// Unfreeze profile - ready
// Change profile main data - ready
// Change Services and price - ready
// Change add services - ready
// Change profile custom links - ready
// Change profile links - ready

// Profile up - x
// Activate profile - x
// Deactivate profile - x
// Upload avatar - x
// Upload gallery - x

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('/data')
  @Roles(Role.MODEL)
  async getProfileData(@SessionInfo() sessionInfo: Session) {
    return this.profilesService.getProfileByUserId(sessionInfo.id);
  }

  @Post('/upload-avatar')
  @Roles(Role.MODEL)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @SessionInfo() sessionInfo: Session,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: new RegExp(/^image\/(jpeg|png|webp)$/i),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.profilesService.uploadProfileAvatar(sessionInfo.id, file);
  }
  @Post('/upload-gallery')
  @Roles(Role.MODEL)
  @UseInterceptors(FileInterceptor('files'))
  async uploadGallery(
    @SessionInfo() sessionInfo: Session,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: new RegExp(/^image\/(jpeg|png|webp)$/i),
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    await this.profilesService.uploadProfileGallery(sessionInfo.id, files);
  }

  @Post('/change-currencies')
  @Roles(Role.MODEL)
  async addCurrencies(
    @SessionInfo() sessionInfo: Session,
    @Body() body: { currencyId: string[] },
  ) {
    await this.profilesService.changeProfileCurrencies(
      sessionInfo.id,
      body.currencyId,
    );
  }

  @Post('/change-add-services')
  @Roles(Role.MODEL)
  async addAdditionalServices(
    @SessionInfo() sessionInfo: Session,
    @Body() body: { additionalServicesId: string[] },
  ) {
    await this.profilesService.changeProfileAdditionalServices(
      sessionInfo.id,
      body.additionalServicesId,
    );
  }
  @Post('/change-services')
  @Roles(Role.MODEL)
  async addServices(
    @SessionInfo() sessionInfo: Session,
    @Body() body: { services: { id: string; price: string }[] },
  ) {
    await this.profilesService.changeProfileServices(
      sessionInfo.id,
      body.services,
    );
  }
  @Post('/change-messengers')
  @Roles(Role.MODEL)
  async addMessengers(
    @SessionInfo() sessionInfo: Session,
    @Body() body: { messengers: { id: string; href: string }[] },
  ) {
    await this.profilesService.changeProfileLinks(
      sessionInfo.id,
      body.messengers,
    );
  }

  @Post('/change-custom-links')
  @Roles(Role.MODEL)
  async addCustomLinks(
    @SessionInfo() sessionInfo: Session,
    @Body() body: { customLinks: { href: string; linkName: string }[] },
  ) {
    await this.profilesService.changeProfileCustomLinks(
      sessionInfo.id,
      body.customLinks,
    );
  }

  @Post('/up-balance')
  @Roles(Role.ADMIN)
  async upBalanceUser(@Body() body: UpProfileBalanceDto) {
    await this.profilesService.changeProfileBalance(body);
    return;
  }

  @Post('/change-description')
  @Roles(Role.MODEL)
  async changeProfileDescription(
    @SessionInfo() sessionInfo: Session,
    @Body() body: ChangeProfileDescriptionDto,
  ) {
    await this.profilesService.changeProfileDescription({
      description: body.description,
      userId: sessionInfo.id,
    });
    return;
  }

  @Post('/change-name')
  @Roles(Role.MODEL)
  async changeProfileName(@Body() body: ChangeProfileNameDto) {
    await this.profilesService.changeProfileName(body);
    return;
  }

  @Post('/change-main-data')
  @Roles(Role.MODEL)
  async changeProfileMainData(
    @SessionInfo() sessionInfo: Session,
    @Body() body: ChangeProfileMainDataDto,
  ) {
    await this.profilesService.changeProfileMainData({
      ...body,
      userId: sessionInfo.id,
    });
    return;
  }

  @Get('/up')
  @Roles(Role.MODEL)
  async upProfile(@SessionInfo() sessionInfo: Session) {
    await this.profilesService.upProfile({ userId: sessionInfo.id });
    return;
  }

  @Get('/activate')
  @Roles(Role.MODEL)
  async activateProfile(@SessionInfo() sessionInfo: Session) {
    await this.profilesService.activateProfile({ userId: sessionInfo.id });
    return;
  }

  @Post('/freeze')
  @Roles(Role.ADMIN)
  async freezeProfile(@Body() body: FreezeProfileDto) {
    await this.profilesService.freezeProfile(body);
    return;
  }

  @Post('/unfreeze')
  @Roles(Role.ADMIN)
  async unFreezeProfile(@Body() body: UnFreezeProfileDto) {
    await this.profilesService.unFreezeProfile(body);
    return;
  }
}
