import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return the user when valid email and password are provided', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = {
        email,
        password: hashedPassword,
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue({
        ...user,
        id: 1,
        userName: 'testuser',
        role: 'User',
      });
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const result = await authService.validateUser(email, password);
      delete user.password;
      expect(result).toEqual({
        ...user,
        id: 1,
        userName: 'testuser',
        role: 'User',
      });
    });

    it('should return null when invalid email or password are provided', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = bcrypt.hashSync('different-password', 10);
      const user = {
        email,
        password: hashedPassword,
      };

      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValue({ ...user, id: 1, userName: 'testuser' });
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      const result = await authService.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return user and token when valid email and password are provided', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = {
        email,
        password: hashedPassword,
      };
      const token = 'token';

      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValue({ ...user, id: 1, userName: 'testuser' });
      jest.spyOn(authService, 'comparePasswords').mockResolvedValue(true);
      jest.spyOn(authService, 'generateToken').mockResolvedValue(token);

      const result = await authService.login({ email, password });

      expect(result).toEqual({
        user: { ...user, id: 1, userName: 'testuser' },
        token,
      });
    });

    it('should throw an error when user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password';

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      await expect(authService.login({ email, password })).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw an error when invalid password is provided', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = bcrypt.hashSync('different-password', 10);
      const user = {
        email,
        password: hashedPassword,
      };

      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValue({ ...user, id: 1, userName: 'testuser' });
      jest.spyOn(authService, 'comparePasswords').mockResolvedValue(false);

      await expect(authService.login({ email, password })).rejects.toThrow(
        'Invalid password',
      );
    });
  });

  describe('profile', () => {
    it('should return the user when a valid userId is provided', async () => {
      const userId = 1;
      const hashedPassword = bcrypt.hashSync('different-password', 10);
      const user = {
        id: userId,
        userName: 'testuser',
      };

      jest.spyOn(userService, 'findById').mockResolvedValue({
        ...user,
        email: 'test@example.com',
        password: hashedPassword,
      });

      const result = await authService.profile(userId);

      expect(result).toEqual({
        ...user,
        email: 'test@example.com',
        password: hashedPassword,
      });
    });

    it('should throw an error when user is not found', async () => {
      const userId = 1;

      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      await expect(authService.profile(userId)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('signup', () => {
    it('should create a new user and return the user and token', async () => {
      const userName = 'testuser';
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = bcrypt.hashSync('different-password', 10);
      const user = {
        id: 1,
        userName,
        email,
        password: hashedPassword,
      };
      const token = 'token';

      jest.spyOn(userService, 'createUser').mockResolvedValue(user);
      jest.spyOn(authService, 'generateToken').mockResolvedValue(token);

      const result = await authService.signup({ userName, email, password });

      expect(result).toEqual({ user, token });
    });
  });

  describe('comparePasswords', () => {
    it('should return true when passwords match', async () => {
      const password = 'password';
      const hashedPassword = bcrypt.hashSync(password, 10);

      const result = await authService.comparePasswords(
        password,
        hashedPassword,
      );

      expect(result).toBe(true);
    });

    it('should return false when passwords do not match', async () => {
      const password = 'password';
      const hashedPassword = bcrypt.hashSync('different-password', 10);

      const result = await authService.comparePasswords(
        password,
        hashedPassword,
      );

      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a token with the user ID and username', async () => {
      const user = {
        id: 1,
        username: 'testuser',
      };
      const token = 'token';

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.generateToken(user);

      expect(result).toBe(token);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        username: user.username,
      });
    });
  });
});
