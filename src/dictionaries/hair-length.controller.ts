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
import { HairLengthService } from './hair-length.service';
import { CreateHairLengthDto } from './dto/create-hair-length-dto';
import { UpdateHairLengthDto } from './dto/update-hair-length-dto';

@ApiTags('hair-lengths')
@Controller('hair-lengths')
export class HairLengthController {
  constructor(private readonly hairLengthService: HairLengthService) {}

  @Get()
  async findAll() {
    return this.hairLengthService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.hairLengthService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateHairLengthDto) {
    return this.hairLengthService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateHairLengthDto) {
    return this.hairLengthService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.hairLengthService.delete(id);
  }
}
