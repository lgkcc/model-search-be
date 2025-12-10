import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateMessengerDto } from './dto/create-messenger-dto';
import { UpdateMessengerDto } from './dto/update-messenger-dto';

@Injectable()
export class MessengerService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.messengerDictionary.findMany();
  }

  async findOne(id: string) {
    const item = await this.dbService.messengerDictionary.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Messenger not found');
    }
    return item;
  }

  async create(dto: CreateMessengerDto) {
    return this.dbService.messengerDictionary.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateMessengerDto) {
    await this.findOne(id);
    return this.dbService.messengerDictionary.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.dbService.messengerDictionary.delete({
      where: { id },
    });
  }
}
