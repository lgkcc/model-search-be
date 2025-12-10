import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateAdditionalServicesDto } from './dto/create-additional-services-dto';
import { UpdateAdditionalServicesDto } from './dto/update-additional-services-dto';

@Injectable()
export class AdditionalServicesService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.additionalServicesDictionary.findMany();
  }

  async findOne(id: string) {
    const item = await this.dbService.additionalServicesDictionary.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Additional service not found');
    }
    return item;
  }

  async create(dto: CreateAdditionalServicesDto) {
    return this.dbService.additionalServicesDictionary.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateAdditionalServicesDto) {
    await this.findOne(id);
    return this.dbService.additionalServicesDictionary.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.dbService.additionalServicesDictionary.delete({
      where: { id },
    });
  }
}
