// src/reviews/reviews.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ReviewEntity } from './entities/review.entity'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto'
import { AllApiResponse, OneApiResponse } from 'src/common/interfaces/response-api.interface'
import { BooksService } from 'src/books/books.service'

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewsRepository: Repository<ReviewEntity>,
    private readonly booksService: BooksService,
  ) { }

  async create(dto: CreateReviewDto): Promise<ReviewEntity> {
    const existing = await this.reviewsRepository.findOne({
      where: { userId: dto.userId, bookId: dto.bookId, isActive: true }
    })
    if (existing) {
      existing.rating = dto.rating
      existing.comment = dto.comment
      const updated = await this.reviewsRepository.save(existing)
      await this.booksService.updateAverageRating(dto.bookId)
      return updated
    }
    const review = this.reviewsRepository.create(dto)
    const saved = await this.reviewsRepository.save(review)
    await this.booksService.updateAverageRating(dto.bookId)
    return saved
  }

  async findAll(p: PaginationDto): Promise<AllApiResponse<ReviewEntity>> {
    const { page, limit, bookId } = p
    const skip = (page - 1) * limit
    const qb = this.reviewsRepository
      .createQueryBuilder('review')
      .where('review.isActive = :active', { active: true })

    if (bookId) {
      qb.andWhere('review.bookId = :bookId', { bookId })
    }

    const [total, data] = await Promise.all([
      qb.getCount(),
      qb
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.book', 'book')
        .take(limit)
        .skip(skip)
        .getMany(),
    ])

    const lastPage = Math.ceil(total / limit)
    return {
      status: { statusMsg: 'ACCEPTED', statusCode: 200, error: null },
      meta: { page, limit, lastPage, total },
      data,
    }
  }

  async findOne(id: string): Promise<OneApiResponse<ReviewEntity>> {
    const review = await this.reviewsRepository.findOne({
      where: { id, isActive: true },
      relations: ['user', 'book']
    })
    return {
      status: { statusMsg: 'ACCEPTED', statusCode: 200, error: null },
      data: review,
    }
  }

  async update(id: string, dto: UpdateReviewDto): Promise<ReviewEntity> {
    await this.reviewsRepository.update({ id }, dto)
    return await this.reviewsRepository.findOne({
      where: { id },
      relations: ['user', 'book']
    })
  }

  async remove(id: string): Promise<void> {
    await this.reviewsRepository.update({ id }, { isActive: false })
  }
}
