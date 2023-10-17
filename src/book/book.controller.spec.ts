import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRoleEnum } from '../users/enums/user-role.enum';
import { FilterBooksDto } from './dto/filter-book.dto';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Override the guard for testing purposes
      .useValue({ canActivate: () => true }) // Mock the guard's canActivate method
      .compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Book 100',
        url: 'book1.com',
        category: 'Cooking',
        price: 100,
        releaseDate: new Date(),
        authorId: 1,
      };
      const expectedResult = {
        id: 1,
        title: 'Book 100',
        url: 'book1.com',
        category: 'Cooking',
        price: 100,
        releaseDate: new Date(),
        authorId: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mock = jest.spyOn(service, 'create');
      mock.mockImplementation(() => Promise.resolve(expectedResult));

      const req: Request = {
        user: { userId: 1, role: UserRoleEnum.AUTHOR },
      } as unknown as Request;

      const result = await controller.create(req, createBookDto);

      expect(result).toBe(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of Books with filters', async () => {
      const filterDto: FilterBooksDto = {
        page: 1,
        limit: 10,
        priceRange: '100,200',
        releaseDateRange: '2021-01-01,2021-12-31',
      };

      const expectedBooks = [
        {
          id: 1,
          title: 'Book 100',
          url: 'book1.com',
          category: 'Cooking',
          price: 100,
          releaseDate: new Date(),
          authorId: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 1,
          title: 'Book 100',
          url: 'book1.com',
          category: 'Cooking',
          price: 100,
          releaseDate: new Date(),
          authorId: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue({
        items: expectedBooks,
        total: expectedBooks.length,
      });

      const result = await controller.findAll(filterDto);
      expect(result).toEqual({
        items: expectedBooks,
        total: expectedBooks.length,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      const id = '1';
      const expectedResult = {
        id: 1,
        title: 'Book 100',
        url: 'book1.com',
        category: 'Cooking',
        price: 100,
        releaseDate: new Date(),
        authorId: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mock = jest.spyOn(service, 'findOne');
      mock.mockImplementation(() => Promise.resolve(expectedResult));

      const result = await controller.findOne(id);

      expect(result).toBe(expectedResult);
    });
  });

  describe('update', () => {
    it('should update an existing Book', async () => {
      const id = '1'; // Fill in the ID of the url check
      const updateBookDto: UpdateBookDto = {
        title: 'Book 3',
      };
      const expectedResult = {
        id: 1,
        title: 'Book 100',
        url: 'book1.com',
        category: 'Cooking',
        price: 100,
        releaseDate: new Date(),
        authorId: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mock = jest.spyOn(service, 'update');
      mock.mockImplementation(() => Promise.resolve(expectedResult));

      const result = await controller.update(id, updateBookDto);

      expect(result).toBe(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove an existing Book', async () => {
      const id = '1';
      const expectedResult = 'Book deleted';

      const mock = jest.spyOn(service, 'remove');
      mock.mockImplementation(() => Promise.resolve(expectedResult));

      const result = await controller.remove(id);

      expect(result).toBe(expectedResult);
    });
  });
});
