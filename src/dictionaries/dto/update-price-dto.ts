import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdatePriceDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;

  @IsNotEmpty()
  @IsString()
  key: string;
}
