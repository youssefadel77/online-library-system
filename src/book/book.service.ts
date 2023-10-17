import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { FilterBooksDto } from './dto/filter-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(data: CreateBookDto) {
    const book = await this.bookRepository.save(data);
    return book;
  }

  async findOne(id: number) {
    await this.validateBookExistence(id);
    return this.bookRepository.findOne({ where: { id } });
  }

  async findAll(filters: FilterBooksDto) {
    const query = this.bookRepository.createQueryBuilder('book');
    this.applyBookFilters(query, filters);
    const [items, total] = await query
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getManyAndCount();

    return { items, total };
  }

  private applyBookFilters(query, filters: FilterBooksDto) {
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange.split(',').map(Number);
      if (minPrice) {
        query.andWhere('book.price >= :minPrice', { minPrice });
      }
      if (maxPrice) {
        query.andWhere('book.price <= :maxPrice', { maxPrice });
      }
    }

    if (filters.releaseDateRange) {
      const [minReleaseDate, maxReleaseDate] =
        filters.releaseDateRange.split(',');
      if (minReleaseDate) {
        query.andWhere('book.releaseDate >= :minReleaseDate', {
          minReleaseDate,
        });
      }
      if (maxReleaseDate) {
        query.andWhere('book.releaseDate <= :maxReleaseDate', {
          maxReleaseDate,
        });
      }
    }

    if (filters.title) {
      query.andWhere('book.title LIKE :title', { title: `%${filters.title}%` });
    }

    if (filters.category) {
      query.andWhere('book.category LIKE :category', {
        category: `%${filters.category}%`,
      });
    }
    if (filters.authors) {
      const authorsList = filters.authors.split(',').map(Number);
      if (authorsList.length > 0) {
        query.andWhere('book.authorId IN (:...authorsList)', { authorsList });
      }
    }
  }

  async update(id: number, data: UpdateBookDto) {
    await this.validateBookExistence(id);
    await this.bookRepository.update(id, data);
    const book = await this.bookRepository.findOne({ where: { id } });
    return book;
  }

  async remove(id: number) {
    await this.validateBookExistence(id);
    await this.bookRepository.delete(id);
    return 'Book deleted';
  }

  async validateBookExistence(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Book not found',
          error: HttpStatus[404],
        },
        404,
      );
    }
  }
}
