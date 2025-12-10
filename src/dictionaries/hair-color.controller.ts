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
import { HairColorService } from './hair-color.service';
import { CreateHairColorDto } from './dto/create-hair-color-dto';
import { UpdateHairColorDto } from './dto/update-hair-color-dto';

@ApiTags('hair-colors')
@Controller('hair-colors')
export class HairColorController {
  constructor(private readonly hairColorService: HairColorService) {}

  @Get()
  async findAll() {
    return this.hairColorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.hairColorService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateHairColorDto) {
    return this.hairColorService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateHairColorDto) {
    return this.hairColorService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.hairColorService.delete(id);
  }
}
