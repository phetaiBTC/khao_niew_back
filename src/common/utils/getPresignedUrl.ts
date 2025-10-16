import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPresignedUrl(key: string) {
  const s3 = new S3Client({
    region: process.env.WASABI_REGION!,
    endpoint: process.env.WASABI_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.WASABI_ACCESS_KEY!,
      secretAccessKey: process.env.WASABI_SECRET_KEY!,
    },
  });

  const command = new GetObjectCommand({
    Bucket: process.env.WASABI_BUCKET!,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 ชั่วโมง
  return url;
}
