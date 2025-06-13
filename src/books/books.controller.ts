import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
} from "@nestjs/common";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { PaginationDto } from "src/common/dtos/pagination/pagination.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { PublicAccess } from "src/auth/decorators/public.decorator";
import { Response } from "express";

@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(@Body() createBookDto: CreateBookDto, @UploadedFile() file: Express.Multer.File) {
    const newBook = await this.booksService.create(createBookDto, file);
    return newBook;
  }

  @PublicAccess()
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.booksService.findAll(paginationDto);
  }

  @Get("search")
  @PublicAccess()
  async SearchBook(@Query() paginationDto: PaginationDto) {
    return this.booksService.SearchBook(paginationDto);
  }

  @PublicAccess()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return await this.booksService.update(id, updateBookDto, file);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.booksService.remove(id);
  }

  @PublicAccess()
  @Get(":id/download")
  async downloadBook(@Param("id") id: string, @Res() res: Response) {
    const downloadUrl = await this.booksService.getDownloadUrl(id);
    res.redirect(downloadUrl.data);
  }
}
