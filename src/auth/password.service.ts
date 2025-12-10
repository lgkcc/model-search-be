import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
  async comparePassword(
    inputPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, userPassword);
  }
}
