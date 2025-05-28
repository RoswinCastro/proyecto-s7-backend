import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post()
  async create(@Body() dto: CreateFavoriteDto, @Req() req: Request) {
    return this.favoritesService.create(dto.bookId, req.user['id']);
  }

  @Get()
  // si usas un guard
  async findAll(@Req() req: Request, @Query() paginationDto: PaginationDto) {
    const user = req.user as any; // o la forma como obtienes el usuario desde el JWT
    return this.favoritesService.findAll(user.id, paginationDto);
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.favoritesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFavoriteDto) {
    return this.favoritesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.favoritesService.remove(id);
  }
}
