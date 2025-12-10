import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdditionalServicesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public value: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public key: string;
}
