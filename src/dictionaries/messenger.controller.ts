import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/const/const';
import { MessengerService } from './messenger.service';
import { CreateMessengerDto } from './dto/create-messenger-dto';
import { UpdateMessengerDto } from './dto/update-messenger-dto';

@ApiTags('messengers')
@Controller('messengers')
export class MessengerController {
  constructor(private readonly messengerService: MessengerService) {}

  @Get()
  async findAll() {
    return this.messengerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.messengerService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateMessengerDto) {
    return this.messengerService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateMessengerDto) {
    return this.messengerService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.messengerService.delete(id);
  }
}
