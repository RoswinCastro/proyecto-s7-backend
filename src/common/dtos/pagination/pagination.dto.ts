import { IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';


export class PaginationDto {
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @IsNumber()
  @IsOptional()
  limit: number = 10;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsUUID()
  bookId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;
}
