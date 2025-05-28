import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { FavoriteEntity } from './entities/favorite.entity';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { AllApiResponse, OneApiResponse } from 'src/common/interfaces/response-api.interface';
import { ManagerError } from 'src/common/errors/manager.error';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoritesRepository: Repository<FavoriteEntity>,
  ) { }

  async create(bookId: string, userId: string): Promise<FavoriteEntity> {
    try {
      const exists = await this.favoritesRepository.findOne({
        where: { book: { id: bookId }, user: { id: userId }, isActive: true }
      });

      if (exists) return exists;

      const favorite = this.favoritesRepository.create({
        book: { id: bookId },
        user: { id: userId },
      });

      return await this.favoritesRepository.save(favorite);
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(userId: string, paginationDto: PaginationDto): Promise<AllApiResponse<FavoriteEntity>> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [total, data] = await Promise.all([
        this.favoritesRepository.count({ where: { isActive: true, user: { id: userId } } }),
        this.favoritesRepository.find({
          where: { isActive: true, user: { id: userId } },
          relations: ['book'],
          take: limit,
          skip,
        }),
      ])

      return {
        status: {
          statusMsg: 'ACCEPTED',
          statusCode: 200,
          error: null,
        },
        meta: { page, limit, lastPage: Math.ceil(total / limit), total },
        data,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message)
    }
  }


  async findOne(id: string): Promise<OneApiResponse<FavoriteEntity>> {
    try {
      const favorite = await this.favoritesRepository.findOne({
        where: { id, isActive: true },
        relations: ['book', 'user'],
      });

      if (!favorite) {
        throw new ManagerError({ type: 'NOT_FOUND', message: 'favorite not found!' });
      }

      return {
        status: { statusMsg: 'ACCEPTED', statusCode: 200, error: null },
        data: favorite,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, dto: UpdateFavoriteDto): Promise<FavoriteEntity> {
    try {
      await this.favoritesRepository.update(id, dto as DeepPartial<FavoriteEntity>);
      const updated = await this.favoritesRepository.findOne({ where: { id } });
      if (!updated) {
        throw new ManagerError({ type: 'NOT_FOUND', message: 'favorite not found!' });
      }
      return updated;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.favoritesRepository.update(id, { isActive: false });
      if (result.affected === 0) {
        throw new ManagerError({ type: 'NOT_FOUND', message: 'favorite not found!' });
      }
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
