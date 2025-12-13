import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { PriceService } from '../dictionaries/price.service';
import process from 'node:process';
import dayjs from 'dayjs';
import { ImagesService } from '../images/images.service';

@Injectable()
export class ProfilesService {
  constructor(
    private dbService: DbService,
    private imagesService: ImagesService,
    private priceService: PriceService,
  ) {}

  private async updateManyToManyRelation<T>(
    userId: string,
    newIds: string[],
    relationName: string,
    idField: string,
  ) {
    const profile = await this.dbService.profile.findUnique({
      where: { userId },
      select: { [relationName]: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const existing = profile[relationName] as T[];
    const toDelete = existing
      .filter((item) => !newIds.includes(item[idField]))
      .map((item) => item[idField] as string);

    const toCreate = newIds
      .filter((id) => !existing.some((item) => item[idField] === id))
      .map((id) => ({ [idField]: id }));

    await this.dbService.profile.update({
      where: { userId },
      data: {
        [relationName]: {
          deleteMany: { [idField]: { in: toDelete } },
          createMany: { data: toCreate },
        },
      },
    });
  }

  async getAllPublicProfiles(filters?: any, take?: number, skip?: number) {
    const initialFilters = {
      endPublishDate: { gte: new Date() },
      NOT: { upDate: null },
    };
    return this.dbService.profile.findMany({
      where: initialFilters,
      skip,
      take,
      orderBy: { upDate: 'desc' },
      include: { reviews: { where: { isDeleted: false, isPublished: true } } },
      omit: {
        balance: true,
        isFreeze: true,
      },
    });
  }

  async getProfileByUserId(userId: string) {
    const model = await this.dbService.profile.findUnique({
      where: { userId },
      include: {
        additionalServices: true,
        currencies: true,
        services: true,
        messengers: true,
      },
    });
    if (!model) {
      return NotFoundException;
    }
    const modelList = await this.getAllPublicProfiles();
    // const position =
    //   modelList.findIndex((item) => item.userId === userId) + 1 || undefined;

    const position = (() => {
      let min = 0;
      let max = modelList.length - 1;
      while (min <= max) {
        const mid = min + (max - min) / 2;
        const guess = modelList[mid].userId;
        if (guess === userId) {
          return mid + 1;
        }
        if ((modelList[mid].upDate as Date) < (model.upDate as Date)) {
          min = mid + 1;
        } else {
          max = mid;
        }
      }
    })();
    return { ...model, position };
  }

  async changeProfileBalance({
    profileId,
    balance,
  }: {
    profileId: string;
    balance: number;
  }) {
    await this.dbService.profile.update({
      where: { id: profileId },
      data: { balance: { increment: balance } },
    });
  }

  // async updateCurrencies(profileId: string, currencies: string[]) {
  //   const profile = await this.dbService.profile.findUnique({
  //     where: { id: profileId },
  //     select: { currencies: true },
  //   });
  //   if (!profile) {
  //     throw new NotFoundException('Profile not found');
  //   }
  //   const currenciesToDelete: string[] = [];
  //   const currenciesToCreate: { currencyId: string }[] = [];
  //
  //   profile.currencies.forEach((curId) => {
  //     if (!currencies.includes(curId.currencyId)) {
  //       currenciesToDelete.push(curId.currencyId);
  //     }
  //   });
  //
  //   currencies.forEach((curId) => {
  //     if (
  //       !profile.currencies.find(
  //         (profileCur) => profileCur.currencyId === curId,
  //       )
  //     ) {
  //       currenciesToCreate.push({ currencyId: curId });
  //     }
  //   });
  //
  //   // await this.dbService.profile.delete({ where: { id: profileId } });
  //
  //   // await this.dbService.currenciesOnProfiles.deleteMany({
  //   //   where: { currencyId: { in: currenciesToDelete } },
  //   // });
  //
  //   // await this.dbService.currencyDictionary.delete({
  //   //   where: { id: 'cmf70wsdd0001u8h4jsravn9n' },
  //   // });
  //
  //   await this.dbService.profile.update({
  //     where: { id: profileId },
  //     data: {
  //       currencies: {
  //         deleteMany: { currencyId: { in: currenciesToDelete } },
  //         createMany: {
  //           data: currenciesToCreate,
  //         },
  //       },
  //     },
  //   });
  // }

  //Личный кабинет модели
  async changeProfileDescription({
    userId,
    description,
  }: {
    userId: string;
    description: string;
  }) {
    await this.dbService.profile.update({
      where: { userId },
      data: { description },
    });
  }
  async changeProfileName({
    profileId,
    profileName,
  }: {
    profileId: string;
    profileName: string;
  }) {
    await this.dbService.profile.update({
      where: { id: profileId },
      data: { profileName },
    });
  }

  async uploadProfileAvatar(userId: string, file: Express.Multer.File) {
    const [loadedFile] = await this.imagesService.uploadImage([file]);
    await this.dbService.profile.update({
      where: { userId },
      data: {
        image: loadedFile.fileName,
      },
    });
  }
  async uploadProfileGallery(userId: string, files: Express.Multer.File[]) {
    const loadedFiles = await this.imagesService.uploadImage(files);
    await this.dbService.profile.update({
      where: { userId },
      data: {
        galleryImages: { push: loadedFiles.map((file) => file.fileName) },
      },
    });
  }
  async removeProfileGalleryPhoto(userId: string, imageId: string) {
    const profile = await this.dbService.profile.findUnique({
      where: { userId },
    });
    if (!profile) {
      return new ForbiddenException();
    }
    const updateImages = profile.galleryImages.filter(
      (image) => image !== imageId,
    );
    await this.dbService.profile.update({
      where: { userId },
      data: {
        galleryImages: { set: updateImages },
      },
    });
  }
  async changeProfileMainData({
    userId,
    age,
    width,
    height,
    cupSize,
    hairColorId,
    hairHeightId,
    bodyTypeId,
  }: {
    userId: string;
    age: number | null;
    height: number | null;
    width: number | null;
    cupSize: number | null;
    hairColorId: string | null;
    hairHeightId: string | null;
    bodyTypeId: string | null;
  }) {
    await this.dbService.profile.update({
      where: { userId },
      data: {
        age,
        height,
        width,
        cupSize,
        hairColorId,
        hairHeightId,
        bodyTypeId,
      },
    });
  }
  async changeProfileLinks(
    userId: string,
    links: { id: string; href: string }[],
  ) {
    const profile = await this.dbService.profile.findUnique({
      where: { userId },
      select: { messengers: true, id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const existing = profile.messengers;
    const recordLinks: Record<string, string> = links.reduce((prev, cur) => {
      return { ...prev, [cur.id]: cur.href };
    }, {});
    const linksId = Object.keys(recordLinks);
    const toDelete = existing
      .filter((item) => !linksId.includes(item.messengerId))
      .map((item) => item.messengerId);

    const toCreate = linksId
      .filter((id) => !existing.some((item) => item.messengerId === id))
      .map((id) => ({ messengerId: id, href: recordLinks[id] }));

    const toUpdate = existing
      .filter((item) => linksId.includes(item.messengerId))
      .map((item) => ({
        messengerId: item.messengerId,
        href: recordLinks[item.messengerId],
      }));
    await this.dbService.$transaction([
      ...toUpdate.map((item) =>
        this.dbService.messengersOnProfiles.update({
          where: {
            profileId_messengerId: {
              profileId: profile.id,
              messengerId: item.messengerId,
            },
          },
          data: { href: item.href },
        }),
      ),
      this.dbService.profile.update({
        where: { userId },
        data: {
          messengers: {
            deleteMany: { messengerId: { in: toDelete } },
            createMany: { data: toCreate },
          },
        },
      }),
    ]);
  }
  async changeProfileCustomLinks(
    userId: string,
    customLinks: { href: string; linkName: string }[],
  ) {
    await this.dbService.profile.update({
      where: { userId },
      data: {
        customLinks,
      },
    });
  }
  async changeProfileServices(
    userId: string,
    services: { id: string; price: string }[],
  ) {
    const profile = await this.dbService.profile.findUnique({
      where: { userId },
      select: { services: true, id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const existing = profile.services;
    const recordServices: Record<string, string> = services.reduce(
      (prev, cur) => {
        return { ...prev, [cur.id]: cur.price };
      },
      {},
    );
    const servicesId = Object.keys(recordServices);
    const toDelete = existing
      .filter((item) => !servicesId.includes(item.serviceTypeId))
      .map((item) => item.serviceTypeId);

    const toCreate = servicesId
      .filter((id) => !existing.some((item) => item.serviceTypeId === id))
      .map((id) => ({ serviceTypeId: id, price: recordServices[id] }));

    const toUpdate = existing
      .filter((item) => servicesId.includes(item.serviceTypeId))
      .map((item) => ({
        serviceTypeId: item.serviceTypeId,
        price: recordServices[item.serviceTypeId],
      }));
    await this.dbService.$transaction([
      ...toUpdate.map((item) =>
        this.dbService.servicesOnProfile.update({
          where: {
            profileId_serviceTypeId: {
              profileId: profile.id,
              serviceTypeId: item.serviceTypeId,
            },
          },
          data: { price: item.price },
        }),
      ),
      this.dbService.profile.update({
        where: { userId },
        data: {
          services: {
            deleteMany: { serviceTypeId: { in: toDelete } },
            createMany: { data: toCreate },
          },
        },
      }),
    ]);
  }
  async changeProfileAdditionalServices(
    userId: string,
    additionalServices: string[],
  ) {
    await this.updateManyToManyRelation(
      userId,
      additionalServices,
      'additionalServices',
      'additionalServicesId',
    );
    // const profile = await this.dbService.profile.findUnique({
    //   where: { id: profileId },
    //   select: { additionalServices: true },
    // });
    // if (!profile) {
    //   throw new NotFoundException('Profile not found');
    // }
    // const additionalServicesToDelete: string[] = [];
    // const additionalServicesToCreate: { additionalServicesId: string }[] = [];
    //
    // profile.additionalServices.forEach((service) => {
    //   if (!additionalServices.includes(service.additionalServicesId)) {
    //     additionalServicesToDelete.push(service.additionalServicesId);
    //   }
    // });
    //
    // additionalServices.forEach((serviceId) => {
    //   if (
    //     !profile.additionalServices.find(
    //       (profileService) => profileService.additionalServicesId === serviceId,
    //     )
    //   ) {
    //     additionalServicesToCreate.push({ additionalServicesId: serviceId });
    //   }
    // });
    //
    // await this.dbService.profile.update({
    //   where: { id: profileId },
    //   data: {
    //     additionalServices: {
    //       deleteMany: {
    //         additionalServicesId: { in: additionalServicesToDelete },
    //       },
    //       createMany: {
    //         data: additionalServicesToCreate,
    //       },
    //     },
    //   },
    // });
  }
  async changeProfileCurrencies(userId: string, currencies: string[]) {
    await this.updateManyToManyRelation(
      userId,
      currencies,
      'currencies',
      'currencyId',
    );
    // const profile = await this.dbService.profile.findUnique({
    //   where: { id: profileId },
    //   select: { currencies: true },
    // });
    // if (!profile) {
    //   throw new NotFoundException('Profile not found');
    // }
    // const currenciesToDelete: string[] = [];
    // const currenciesToCreate: { currencyId: string }[] = [];
    //
    // profile.currencies.forEach((curId) => {
    //   if (!currencies.includes(curId.currencyId)) {
    //     currenciesToDelete.push(curId.currencyId);
    //   }
    // });
    //
    // currencies.forEach((curId) => {
    //   if (
    //     !profile.currencies.find(
    //       (profileCur) => profileCur.currencyId === curId,
    //     )
    //   ) {
    //     currenciesToCreate.push({ currencyId: curId });
    //   }
    // });
    //
    // await this.dbService.profile.update({
    //   where: { id: profileId },
    //   data: {
    //     currencies: {
    //       deleteMany: { currencyId: { in: currenciesToDelete } },
    //       createMany: {
    //         data: currenciesToCreate,
    //       },
    //     },
    //   },
    // });
  }
  async changeProfileAdditionalImages(profileId: string) {}

  async upProfileByProfileId({ profileId }: { profileId: string }) {
    const key = process.env.UP_PRICE ?? 'UP_PROFILE_PRICE';
    const price = await this.priceService.getPriceByKey(key);
    await this.dbService.profile.update({
      where: { id: profileId },
      data: { balance: { decrement: price }, upDate: new Date() },
    });
  }
  async upProfile({ userId }: { userId: string }) {
    const key = process.env.UP_PRICE ?? 'UP_PROFILE_PRICE';
    const price = await this.priceService.getPriceByKey(key);
    await this.dbService.profile.update({
      where: { userId },
      data: { balance: { decrement: price }, upDate: new Date() },
    });
  }
  async activateProfile({ userId }: { userId: string }) {
    const price = await this.priceService.getPriceByKey(
      'ACTIVATE_PROFILE_PRICE',
    );
    const profile = await this.dbService.profile.findUnique({
      where: { userId: userId },
    });
    if (!profile) return;
    if (
      profile?.endPublishDate &&
      dayjs(new Date()).isBefore(profile?.endPublishDate)
    ) {
      const remainsTime = String(
        new Date(profile.endPublishDate).getTime() - Date.now(),
      );
      await this.dbService.profile.update({
        where: { userId },
        data: {
          endPublishDate: null,
          remainsTime,
        },
      });
    } else if (profile?.remainsTime) {
      const endPublishDate = new Date(Date.now() + +profile.remainsTime);
      await this.dbService.profile.update({
        where: { userId },
        data: {
          remainsTime: null,
          endPublishDate,
        },
      });
    } else {
      if (profile.balance < price) return;
      const endPublishDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await this.dbService.profile.update({
        where: { userId },
        data: {
          balance: { decrement: price },
          endPublishDate,
          remainsTime: null,
          upDate: new Date(),
        },
      });
    }
  }

  //Админ панель
  async freezeProfile({ profileId }: { profileId: string }) {
    await this.dbService.profile.update({
      where: { id: profileId },
      data: { isFreeze: true },
    });
  }
  async unFreezeProfile({ profileId }: { profileId: string }) {
    await this.dbService.profile.update({
      where: { id: profileId },
      data: { isFreeze: false },
    });
  }
  // async blockProfile({ profileId }: { profileId: string }) {
  //   await this.dbService.profile.update({
  //     where: { id: profileId },
  //     data: { isFreeze: true },
  //   });
  // }
  // async unBlockProfile({ profileId }: { profileId: string }) {
  //   await this.dbService.profile.update({
  //     where: { id: profileId },
  //     data: { isFreeze: true },
  //   });
  // }
}
