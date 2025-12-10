import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @MinLength(10)
  text: string;
}
