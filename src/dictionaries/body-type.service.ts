import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateBodyTypeDto } from './dto/create-body-type-dto';
import { UpdateBodyTypeDto } from './dto/update-body-type-dto';

@Injectable()
export class BodyTypeService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.bodyTypeDictionary.findMany();
  }

  async findOne(id: string) {
    const item = await this.dbService.bodyTypeDictionary.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Body type not found');
    }
    return item;
  }

  async create(dto: CreateBodyTypeDto) {
    return this.dbService.bodyTypeDictionary.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateBodyTypeDto) {
    await this.findOne(id);
    return this.dbService.bodyTypeDictionary.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.dbService.bodyTypeDictionary.delete({
      where: { id },
    });
  }
}
