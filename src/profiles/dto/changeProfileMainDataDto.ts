import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class ChangeProfileMainDataDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  age: number | null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  width: number | null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  height: number | null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cupSize: number | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  hairColorId: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  hairHeightId: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bodyTypeId: string | null;
}
