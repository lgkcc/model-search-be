import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAdditionalServicesDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public value?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public key?: string;
}
