import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-book.dto';

describe('BookService', () => {
  let service: BookService;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return filtered and paginated books', async () => {
      const filters: FilterBooksDto = {
        page: 1,
        limit: 10,
        priceRange: '1,200',
        releaseDateRange: '2023-09-01,2023-10-30',
      };

      const mockBooks = [
        {
          id: 8,
          title: 'Book 100',
          url: 'book1.com',
          category: 'Cooking',
          price: 100,
          releaseDate: '2023-10-01',
          authorId: 4,
          created_at: '2023-10-16T12:04:11.708Z',
          updated_at: '2023-10-16T12:04:11.708Z',
        },
        {
          id: 9,
          title: 'Book 100',
          url: 'book1.com',
          category: 'Cooking',
          price: 100,
          releaseDate: '2023-10-01',
          authorId: 4,
          created_at: '2023-10-16T12:04:11.708Z',
          updated_at: '2023-10-16T12:04:11.708Z',
        },
        {
          id: 10,
          title: 'Book 100',
          url: 'book1.com',
          category: 'Cooking',
          price: 100,
          releaseDate: '2023-10-01',
          authorId: 4,
          created_at: '2023-10-16T12:04:11.708Z',
          updated_at: '2023-10-16T12:04:11.708Z',
        },
      ];

      const totalCount = mockBooks.length;

      // Spy on the createQueryBuilder method of the repository
      const createQueryBuilderSpy = jest.spyOn(
        bookRepository,
        'createQueryBuilder',
      );

      // Mock the behavior of the query builder methods
      createQueryBuilderSpy.mockReturnValueOnce({
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockBooks, totalCount]),
      } as any);

      const result = await service.findAll(filters);

      expect(result.items).toEqual(mockBooks);
      expect(result.total).toEqual(totalCount);

      // Verify that createQueryBuilder was called with the correct argument
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('book');
    });
  });

  describe('update', () => {
    it('should update a book if it exists', async () => {
      const bookId = 1;
      const updateBookDto: UpdateBookDto = {
        title: 'Book 100',
        url: 'book1.com',
        category: 'Cooking',
        price: 100,
        releaseDate: new Date(),
        authorId: 1,
      };

      const mockFoundBook = new Book();
      mockFoundBook.id = bookId;

      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(mockFoundBook);
      jest.spyOn(bookRepository, 'update').mockResolvedValue(undefined);

      const result = await service.update(bookId, updateBookDto);

      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
      });
      expect(bookRepository.update).toHaveBeenCalledWith(bookId, updateBookDto);
      expect(result).toEqual(mockFoundBook);
    });

    it('should throw an exception if the book does not exist', async () => {
      const bookId = 1;
      const updateBookDto: UpdateBookDto = {
        title: 'Book 100',
        url: 'book1.com',
        category: 'Cooking',
        price: 100,
        releaseDate: new Date(),
        authorId: 1,
      };

      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

      try {
        await service.update(bookId, updateBookDto);
        fail('Expected exception to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(error.getResponse()).toEqual({
          statusCode: 404,
          message: 'Book not found',
          error: HttpStatus[404],
        });
      }
    });
  });

  describe('findOne', () => {
    it('should find a book by ID if it exists', async () => {
      const bookId = 1;
      const mockFoundBook = new Book();
      mockFoundBook.id = bookId;

      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(mockFoundBook);

      const result = await service.findOne(bookId);

      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
      });
      expect(result).toEqual(mockFoundBook);
    });

    it('should throw an exception if the book does not exist', async () => {
      const bookId = 1;

      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(bookId);
        fail('Expected exception to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(error.getResponse()).toEqual({
          statusCode: 404,
          message: 'Book not found',
          error: HttpStatus[404],
        });
      }
    });
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Book 100',
        url: 'book1.com',
        category: 'Cooking',
        price: 100,
        releaseDate: new Date(),
        authorId: 1,
      };

      const mockCreatedBook = new Book();
      mockCreatedBook.id = 1;

      jest.spyOn(bookRepository, 'save').mockResolvedValue(mockCreatedBook);

      const result = await service.create(createBookDto);

      expect(bookRepository.save).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockCreatedBook);
    });
  });

  describe('remove', () => {
    it('should remove a book if it exists', async () => {
      const bookId = 1;
      const mockBook = new Book();
      mockBook.id = bookId;

      // Mock the findOne method to return the book
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(mockBook);
      jest.spyOn(bookRepository, 'delete').mockResolvedValue(undefined);

      // Call the remove method
      const result = await service.remove(bookId);

      // Assert that findOne was called with the correct arguments
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
      });

      // Assert that delete was called with the correct arguments
      expect(bookRepository.delete).toHaveBeenCalledWith(bookId);

      // Assert that the result is 'Book deleted'
      expect(result).toBe('Book deleted');
    });

    it('should throw an exception if the book does not exist', async () => {
      const bookId = 1;

      // Mock the findOne method to return null (book not found)
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

      // Use try-catch to catch the exception
      try {
        await service.remove(bookId);
        // If no exception was thrown, fail the test
        fail('Expected exception to be thrown');
      } catch (error) {
        // Assert that the error is an instance of HttpException with status code 404
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(error.getResponse()).toEqual({
          statusCode: 404,
          message: 'Book not found',
          error: HttpStatus[404],
        });
      }
    });
  });
});
