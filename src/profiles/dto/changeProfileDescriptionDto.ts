import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeProfileDescriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}
