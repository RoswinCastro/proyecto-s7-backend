import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(@Body() createAuthorDto: CreateAuthorDto, @UploadedFile() file?: Express.Multer.File) {
    return this.authorsService.create(createAuthorDto, file);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.authorsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.authorsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('file'))
  async updatePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.authorsService.updatePhoto(id, file);
  }
}
