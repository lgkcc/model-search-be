import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHairColorDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public value?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public key?: string;
}
