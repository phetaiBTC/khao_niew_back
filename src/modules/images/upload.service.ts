import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { baseEnv } from 'src/besa.env';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucket = process.env.WASABI_BUCKET!;

  constructor() {
    this.s3 = new S3Client({
      region: baseEnv.WASABI_REGION!,
      endpoint: baseEnv.WASABI_ENDPOINT!,
      credentials: {
        accessKeyId: baseEnv.WASABI_ACCESS_KEY! ,
        secretAccessKey: baseEnv.WASABI_SECRET_KEY!,
      },
    });
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const uploaded: Array<{ key: string; url: string; }> = [];

    for (const file of files) {
      const key = `uploads/${uuidv4()}${path.extname(file.originalname)}`;

      // upload file
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      // generate presigned URL
      const url = await getSignedUrl(
        this.s3,
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
        { expiresIn: 3600 }, // 1 ชั่วโมง
      );

      uploaded.push({ key, url });
    }

    return uploaded;
  }

    async deleteFile(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    return { message: 'Deleted successfully' };
  }
}
