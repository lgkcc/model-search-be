import { Injectable, OnModuleInit } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import process from 'node:process';

@Injectable()
export class FilesService implements OnModuleInit {
  private s3Client: S3Client;

  onModuleInit() {
    const accessKeyId = process.env.AWS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    if (accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: 'eu-north-1',
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  async uploadBuffer(key: string, contentType: string, buffer: Buffer) {
    const params = {
      Bucket: 'vrt11rf',
      Key: key,
      Body: buffer,
      contentType: contentType,
    };
    const command = new PutObjectCommand(params);
    const data = await this.s3Client.send(command);
    return { data, key };
  }
}
