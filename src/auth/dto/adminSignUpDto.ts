import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminSignUpDto {
  @ApiProperty()
  @IsString({ message: 'Неверный тип данных у поля login' })
  @IsNotEmpty({ message: 'Поле login обязательное' })
  @MinLength(3, { message: 'Логин не может быть меньше 3 символов' })
  @MaxLength(24, { message: 'Логин не может быть больше 24 символов' })
  public login: string;

  @ApiProperty()
  @IsString({ message: 'Неверный тип данных у поля password' })
  @IsNotEmpty({ message: 'Поле password обязательное' })
  @MinLength(8, { message: 'Пароль не может быть меньше 8 символов' })
  @MaxLength(32, { message: 'Пароль не может быть больше 32 символов' })
  public password: string;

  @ApiProperty()
  @IsBoolean({ message: 'Неверный тип данных у поля isAdmin' })
  public isAdmin: boolean = false;

  @ApiProperty()
  @IsString({ message: 'Неверный тип данных у поля profileName' })
  @IsNotEmpty({
    message: 'Поле profileName обязательное при добавление роли MODEL',
  })
  @MinLength(3, { message: 'Имя профиля не может быть меньше 3 символов' })
  @MaxLength(24, { message: 'Имя профиля не может быть больше 24 символов' })
  public profileName: string;
}
