// src/modules/images/image.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ImageService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { customUploadInterceptor } from 'src/common/interceptors/upload-image.interceptor';
import { Roles } from 'src/common/decorator/role.decorator';
import { EnumRole } from '../users/entities/user.entity';
import { Public } from 'src/common/decorator/auth.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('images')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly uploadService: UploadService,
  ) {}

  // @Public()
  // @Post()
  // @UseInterceptors(customUploadInterceptor('images', 'file', true))
  // async uploadImages(
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Body() dto: CreateImageDto,
  // ) {
  //   if (!files || !files.length) throw new Error('No files uploaded');

  //   const urls = files.map((file) => `/uploads/images/${file.filename}`);
  //   return this.imageService.createMany(dto, urls);
  // }

  // @Public()
  // @Post()
  // @UseInterceptors(FilesInterceptor('files')) // key from form-data = 'files'
  // async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
  //   const urls = await this.uploadService.uploadFiles(files);
  //   return this.imageService.createMany(urls);
  // }

  @Public()
  @Post()
  @UseInterceptors(FilesInterceptor('files')) 
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await this.uploadService.uploadFiles_v2(files);
    return this.imageService.createMany_server(urls.uploaded);
  }

  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.imageService.findOne(id);
  }

  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateImageDto) {
    return this.imageService.update(id, dto, 'null');
  }

  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.imageService.remove_server(id);
  }
}
