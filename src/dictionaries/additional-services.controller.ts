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
import { AdditionalServicesService } from './additional-services.service';
import { CreateAdditionalServicesDto } from './dto/create-additional-services-dto';
import { UpdateAdditionalServicesDto } from './dto/update-additional-services-dto';

@ApiTags('additional-services')
@Controller('additional-services')
export class AdditionalServicesController {
  constructor(
    private readonly additionalServicesService: AdditionalServicesService,
  ) {}

  @Get()
  async findAll() {
    return this.additionalServicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.additionalServicesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateAdditionalServicesDto) {
    return this.additionalServicesService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAdditionalServicesDto,
  ) {
    return this.additionalServicesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.additionalServicesService.delete(id);
  }
}
