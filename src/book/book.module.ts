import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    HttpModule,
    forwardRef(() => UsersModule),
    ScheduleModule.forRoot(),
  ],
  controllers: [BookController],
  providers: [BookService, Book],
  exports: [TypeOrmModule.forFeature([Book]), BookService],
})
export class BookModule {}
