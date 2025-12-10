import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateCurrencyDto } from './dto/create-currency-dto';
import { UpdateCurrencyDto } from './dto/update-currency-dto';

@Injectable()
export class CurrencyService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.currencyDictionary.findMany();
  }

  async findOne(id: string) {
    const item = await this.dbService.currencyDictionary.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Currency not found');
    }
    return item;
  }

  async create(dto: CreateCurrencyDto) {
    return this.dbService.currencyDictionary.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateCurrencyDto) {
    await this.findOne(id);
    return this.dbService.currencyDictionary.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.dbService.currencyDictionary.delete({
      where: { id },
    });
  }
}
