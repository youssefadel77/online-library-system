import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserRoleEnum } from '../users/enums/user-role.enum';

@ApiTags('Book')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  create(@Request() req: any, @Body() createBookDto: CreateBookDto) {
    if (req.user.role !== UserRoleEnum.AUTHOR) throw new Error('Unauthorized');
    return this.bookService.create({
      ...createBookDto,
      authorId: req.user.userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  findAll(@Query() filters: FilterBooksDto) {
    return this.bookService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('edit/:id')
  update(@Param('id') id: string, @Body() updateUrlCheckDto: UpdateBookDto) {
    return this.bookService.update(+id, updateUrlCheckDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
