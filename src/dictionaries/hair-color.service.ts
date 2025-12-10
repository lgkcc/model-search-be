import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateHairColorDto } from './dto/create-hair-color-dto';
import { UpdateHairColorDto } from './dto/update-hair-color-dto';

@Injectable()
export class HairColorService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.hairColorDictionary.findMany();
  }

  async findOne(id: string) {
    const item = await this.dbService.hairColorDictionary.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Hair color not found');
    }
    return item;
  }

  async create(dto: CreateHairColorDto) {
    return this.dbService.hairColorDictionary.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateHairColorDto) {
    await this.findOne(id);
    return this.dbService.hairColorDictionary.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.dbService.hairColorDictionary.delete({
      where: { id },
    });
  }
}
