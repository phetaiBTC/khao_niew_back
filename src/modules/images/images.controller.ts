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

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(customUploadInterceptor('images', 'file', true))
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateImageDto,
  ) {
    if (!files || !files.length) throw new Error('No files uploaded');

    const urls = files.map((file) => `/uploads/images/${file.filename}`);
    return this.imageService.createMany(dto, urls);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateImageDto) {
    return this.imageService.update(id, dto, 'null');
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.remove(id);
  }
}
