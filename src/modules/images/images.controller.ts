// src/modules/images/image.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ImageService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { customUploadInterceptor } from 'src/common/interceptors/upload-image.interceptor';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}


  @Post()
  @UseInterceptors(customUploadInterceptor('images', 'file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateImageDto) {
    if (!file) throw new Error('No file uploaded');

    const url = `/uploads/images/${file.filename}`; 
    return this.imageService.create(dto, url);
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
    return this.imageService.update(id, dto, "null");
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.remove(id);
  }
}
