import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreatePriceDto } from './dto/create-price-dto';
import { UpdatePriceDto } from './dto/update-price-dto';

@Injectable()
export class PriceService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.priceDictionary.findMany();
  }

  async getPriceByKey(key: string) {
    const data = await this.dbService.priceDictionary.findUnique({
      where: { key },
    });
    return data?.value ?? 1;
  }

  async findOne(id: string) {
    const item = await this.dbService.priceDictionary.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Hair length not found');
    }
    return item;
  }

  async create(dto: CreatePriceDto) {
    return this.dbService.priceDictionary.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdatePriceDto) {
    await this.findOne(id);
    return this.dbService.priceDictionary.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.dbService.priceDictionary.delete({
      where: { id },
    });
  }
}
