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
import { ServicesTypeService } from './services-type.service';
import { CreateServicesTypeDto } from './dto/create-services-type-dto';
import { UpdateServicesTypeDto } from './dto/update-services-type-dto';

@ApiTags('services')
@Controller('services')
export class ServicesTypeController {
  constructor(private readonly servicesTypeService: ServicesTypeService) {}

  @Get()
  async findAll() {
    return this.servicesTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.servicesTypeService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateServicesTypeDto) {
    return this.servicesTypeService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateServicesTypeDto) {
    return this.servicesTypeService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.servicesTypeService.delete(id);
  }
}
