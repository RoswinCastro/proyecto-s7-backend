import { Injectable } from "@nestjs/common";
import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FavoriteEntity } from "./entities/favorite.entity";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { UpdateFavoriteDto } from "./dto/update-favorite.dto";
import { PaginationDto } from "src/common/dtos/pagination/pagination.dto";
import { AllApiResponse, OneApiResponse } from "src/common/interfaces/response-api.interface";
import { ManagerError } from "src/common/errors/manager.error";

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoritesRepository: Repository<FavoriteEntity>
  ) {}

  async create(userId: string, createFavoriteDto: CreateFavoriteDto): Promise<FavoriteEntity> {
    try {
      const favorite = this.favoritesRepository.create({
        book: { id: createFavoriteDto.bookId },
        user: { id: userId }, // lo pasamos explícitamente desde el controlador
      });

      const savedFavorite = await this.favoritesRepository.save(favorite);

      if (!savedFavorite) {
        throw new ManagerError({
          type: "CONFLICT",
          message: "Favorite not created!",
        });
      }

      return savedFavorite;
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
          relations: ["book"],
          take: limit,
          skip,
        }),
      ]);

      return {
        status: {
          statusMsg: "ACCEPTED",
          statusCode: 200,
          error: null,
        },
        meta: { page, limit, lastPage: Math.ceil(total / limit), total },
        data,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
  async findAuthors(userId: string, paginationDto: PaginationDto): Promise<AllApiResponse<FavoriteEntity>> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [total, data] = await Promise.all([
        this.favoritesRepository.count({ where: { isActive: true, user: { id: userId } } }),
        this.favoritesRepository.find({
          where: { isActive: true, user: { id: userId } },
          relations: ["book", "book.author"],

          take: limit,
          skip,
        }),
      ]);

      return {
        status: {
          statusMsg: "ACCEPTED",
          statusCode: 200,
          error: null,
        },
        meta: { page, limit, lastPage: Math.ceil(total / limit), total },
        data,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findOne(id: string): Promise<OneApiResponse<FavoriteEntity>> {
    try {
      const favorite = await this.favoritesRepository.findOne({
        where: { id, isActive: true },
        relations: ["book", "user"], // Carga las relaciones
      });

      if (!favorite) {
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "favorite not found!",
        });
      }

      return {
        status: {
          statusMsg: "ACCEPTED",
          statusCode: 200,
          error: null,
        },
        data: favorite,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateFavoriteDto: UpdateFavoriteDto): Promise<FavoriteEntity> {
    try {
      await this.favoritesRepository.update(id, updateFavoriteDto as DeepPartial<FavoriteEntity>);
      const updatedFavorite = await this.favoritesRepository.findOne({ where: { id } });
      if (!updatedFavorite) {
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "favorite not found!",
        });
      }
      return updatedFavorite;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.favoritesRepository.update(id, { isActive: false });
      if (result.affected === 0) {
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "favorite not found!",
        });
      }
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
