import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { FilesService } from '../files/files.service';
import path from 'node:path';

@Injectable()
export class ImagesService {
  constructor(private FilesService: FilesService) {}
  static createImageKey(file: Express.Multer.File) {
    const fileName = file.originalname;
    const imageExt = ImagesService.getImageExt(file);
    return (
      Date.now() +
      '_' +
      fileName.replaceAll('.', '').replaceAll(imageExt, '') +
      '.' +
      'webp'
    );
  }
  static getImageExt(file: Express.Multer.File) {
    return file.mimetype.split('/')[1];
  }

  async uploadImage(files: Express.Multer.File[]) {
    return await Promise.all<{ fileName: string }>(
      files.map(async (file) => {
        try {
          const keyImage = ImagesService.createImageKey(file);

          // const buffer = Buffer.from(await file.arrayBuffer());
          const buffer = file.buffer;
          const watermark = await this.createWatermark(
            buffer,
            path.join(process.cwd(), 'public', 'logo.svg'),
            // '' as unknown as Buffer,
          );
          const bufferWithWatermark = await this.addImageWatermark(
            buffer,
            watermark,
          );
          const webpBuffer =
            await this.convertBufferToWebpBuffer(bufferWithWatermark);
          const data = await this.FilesService.uploadBuffer(
            keyImage,
            'image/webp',
            webpBuffer,
          );
          console.log(data);
          return { fileName: keyImage };
        } catch (e: any) {
          console.log(e);
          return { fileName: '' };
        }
      }),
    );
  }

  async convertBufferToWebpBuffer(buffer: Buffer) {
    return sharp(buffer).webp({ quality: 70 }).toBuffer();
  }

  createWatermark = async (
    image: Buffer | string,
    watermark: Buffer | string,
  ): Promise<Buffer> => {
    const metadata = await sharp(image).metadata();
    const imageWidth = metadata.width; // Ширина в пикселях

    const watermarkWidth = Math.floor(imageWidth * 0.1);
    return await sharp(watermark)
      .composite([
        {
          input: Buffer.from([0, 0, 0, 24]),
          raw: {
            width: 1,
            height: 1,
            channels: 4,
          },
          tile: true,
          blend: 'dest-in',
        },
      ])
      .resize({
        width: watermarkWidth,
        height: undefined, // Автоматический расчет высоты
        fit: 'inside', // Сохраняет пропорции
      })
      .toBuffer();
  };

  async addImageWatermark(inputPath: any, watermarkPath: any) {
    const mainImage = sharp(inputPath);
    const watermark = sharp(watermarkPath);

    // Получаем размеры основного изображения и водяного знака
    const mainMetadata = await mainImage.metadata();
    const watermarkMetadata = await watermark.metadata();

    const { width: mainWidth, height: mainHeight } = mainMetadata;
    const { width: wmWidth, height: wmHeight } = watermarkMetadata;

    // Вычисляем количество повторений по X и Y
    const cols = Math.ceil(mainWidth / (wmWidth * 1.5));
    const rows = Math.ceil(mainHeight / (wmHeight * 2.5));

    // Создаем массив для composite()
    const compositeLayers: any[] = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        compositeLayers.push({
          input: await watermark.clone().toBuffer(),
          top: y * Math.ceil(wmHeight * 2.5),
          left: x * Math.ceil(wmWidth * 1.5),
          blend: 'over',
        });
      }
    }

    // Накладываем все водяные знаки
    return await mainImage.composite(compositeLayers).toBuffer();
  }
}
