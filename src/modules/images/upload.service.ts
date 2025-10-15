import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { baseEnv } from 'src/besa.env';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucket = process.env.WASABI_BUCKET;

  constructor() {
    this.s3 = new S3Client({
      region: baseEnv.WASABI_REGION,
      endpoint: baseEnv.WASABI_ENDPOINT,
      credentials: {
        accessKeyId: baseEnv.WASABI_ACCESS_KEY,
        secretAccessKey: baseEnv.WASABI_SECRET_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const key = `uploads/${uuidv4()}${path.extname(file.originalname)}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: `${process.env.WASABI_ENDPOINT}/${this.bucket}/${key}`,
    };
  }
}
