import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServicesTypeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public value?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public key?: string;
}
