import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHairLengthDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public value?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public key?: string;
}
