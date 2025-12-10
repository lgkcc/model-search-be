import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordByLoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Поле логи не может быть пустым' })
  public login: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Поле старый пароль не может быть пустым' })
  public oldPassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Поле новый пароль не может быть пустым' })
  public newPassword: string;
}
