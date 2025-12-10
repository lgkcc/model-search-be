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
import { BodyTypeService } from './body-type.service';
import { CreateBodyTypeDto } from './dto/create-body-type-dto';
import { UpdateBodyTypeDto } from './dto/update-body-type-dto';

@ApiTags('body-types')
@Controller('body-types')
export class BodyTypeController {
  constructor(private readonly bodyTypeService: BodyTypeService) {}

  @Get()
  async findAll() {
    return this.bodyTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bodyTypeService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateBodyTypeDto) {
    return this.bodyTypeService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateBodyTypeDto) {
    return this.bodyTypeService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.bodyTypeService.delete(id);
  }
}
