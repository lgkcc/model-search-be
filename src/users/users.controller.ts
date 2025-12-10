import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/const/const';
import { Public } from '../common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  // @Roles(Role.ADMIN)
  @Public()
  async getAll() {
    return this.usersService.getAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findById(@Param('id') id: string) {
    return this.usersService.getAll();
  }

  @Get('/delete:id')
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return;
  }
  @Get('/recovery:id')
  @Roles(Role.ADMIN)
  async recoveryUser(@Param('id') id: string) {
    await this.usersService.recoveryUser(id);
    return;
  }
}
