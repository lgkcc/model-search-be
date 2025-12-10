import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  @IsString({ message: 'Неверный логин или пароль' })
  @IsNotEmpty({ message: 'Неверный логин или пароль' })
  public login: string;

  @ApiProperty()
  @IsString({ message: 'Неверный логин или пароль' })
  @IsNotEmpty({ message: 'Неверный логин или пароль' })
  public password: string;
}
