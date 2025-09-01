import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { promises as fs } from 'fs';

export const customUploadInterceptor = (
  folder: string,
  field = 'file',
  multiple = false,
  maxCount = 10, // กำหนดจำนวนไฟล์สูงสุด
) => {
  const storage = diskStorage({
    destination: async (req, file, cb) => {
      const dir = folder ? join('./uploads', folder) : './uploads/avatars';
      try {
        await fs.mkdir(dir, { recursive: true });
        cb(null, dir);
      } catch (error) {
        console.error('Directory creation failed:', error);
        cb(new InternalServerErrorException('Failed to create directory'), '');
      }
    },

    filename: async (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname).toLowerCase();
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;

      const filePath = join(process.cwd(), 'uploads', folder, filename);
      try {
        if (await fileExists(filePath)) {
          const uniqueFilename = `${file.fieldname}-${uniqueSuffix}-duplicate${ext}`;
          cb(null, uniqueFilename);
        } else {
          cb(null, filename);
        }
      } catch (err) {
        console.error('Error checking file existence:', err);
        cb(new InternalServerErrorException('Error checking file existence'), '');
      }
    },
  });

  const options = {
    storage,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  };

  // เลือก interceptor
  return multiple
    ? FilesInterceptor(field, maxCount, options) // หลายไฟล์
    : FileInterceptor(field, options);          // ไฟล์เดียว
};

// Helper function
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
