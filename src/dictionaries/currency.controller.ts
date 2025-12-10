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
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency-dto';
import { UpdateCurrencyDto } from './dto/update-currency-dto';

@ApiTags('currencies')
@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async findAll() {
    return this.currencyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.currencyService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateCurrencyDto) {
    return this.currencyService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateCurrencyDto) {
    return this.currencyService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.currencyService.delete(id);
  }
}
