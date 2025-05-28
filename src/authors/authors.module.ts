import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService],
  imports: [
    TypeOrmModule.forFeature([AuthorEntity]),
    CloudinaryModule
  ],
  exports: []
})
export class AuthorsModule { }
