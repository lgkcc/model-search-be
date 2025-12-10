import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeProfileNameDto {
  @ApiProperty()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  profileName: string;
}