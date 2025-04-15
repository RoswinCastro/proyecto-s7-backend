import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post()
  async create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.favoritesService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.favoritesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto) {
    return this.favoritesService.update(id, updateFavoriteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.favoritesService.remove(id);
  }
}
