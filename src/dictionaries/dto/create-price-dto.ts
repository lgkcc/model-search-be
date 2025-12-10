import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePriceDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;

  @IsNotEmpty()
  @IsString()
  key: string;
}
