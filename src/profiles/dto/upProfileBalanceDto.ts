import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpProfileBalanceDto {
  @ApiProperty()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  balance: number;
}
