import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UnFreezeProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  profileId: string;
}