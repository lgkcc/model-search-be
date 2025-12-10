import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FreezeProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  profileId: string;
}