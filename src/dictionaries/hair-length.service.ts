import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateHairLengthDto } from './dto/create-hair-length-dto';
import { UpdateHairLengthDto } from './dto/update-hair-length-dto';

@Injectable()
export class HairLengthService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.hairLengthDictionary.findMany();
  }

  async findOne(id: string) {
    const item = await this.dbService.hairLengthDictionary.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Hair length not found');
    }
    return item;
  }

  async create(dto: CreateHairLengthDto) {
    return this.dbService.hairLengthDictionary.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateHairLengthDto) {
    await this.findOne(id);
    return this.dbService.hairLengthDictionary.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.dbService.hairLengthDictionary.delete({
      where: { id },
    });
  }
}
