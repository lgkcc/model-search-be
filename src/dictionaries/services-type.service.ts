import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateServicesTypeDto } from './dto/create-services-type-dto';
import { UpdateServicesTypeDto } from './dto/update-services-type-dto';

@Injectable()
export class ServicesTypeService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.servicesTypeDictionary.findMany();
  }

  async findOne(id: string) {
    const item = await this.dbService.servicesTypeDictionary.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Services type not found');
    }
    return item;
  }

  async create(dto: CreateServicesTypeDto) {
    return this.dbService.servicesTypeDictionary.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateServicesTypeDto) {
    await this.findOne(id); // check if exists
    return this.dbService.servicesTypeDictionary.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id); // check if exists
    return this.dbService.servicesTypeDictionary.delete({
      where: { id },
    });
  }
}
