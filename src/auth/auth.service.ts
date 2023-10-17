import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(data: any) {
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'User not found',
          error: HttpStatus[404],
        },
        404,
      );
    }

    const isPasswordValid = await this.comparePasswords(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        {
          statusCode: 406,
          message: 'Invalid password',
          error: HttpStatus[406],
        },
        406,
      );
    }

    const token = await this.generateToken(user);

    return { user, token };
  }

  async profile(userId: number) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'User not found',
          error: HttpStatus[404],
        },
        404,
      );
    }
    return user;
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async signup(dto: SignupDto): Promise<any> {
    await this.validateEmailExists(dto.email);
    dto.password = bcrypt.hashSync(dto.password, 10);
    const user = await this.userService.createUser(dto);
    const token = await this.generateToken(user);
    return { user, token };
  }

  async generateToken(user) {
    const payload = { sub: user.id, username: user.username, role: user.role };
    return this.jwtService.sign(payload);
  }

  async validateEmailExists(email: string) {
    const userInDb = await this.userService.findByEmail(email);
    if (userInDb) {
      throw new HttpException(
        {
          statusCode: 409,
          message: 'Email already exists',
          error: HttpStatus[409],
        },
        409,
      );
    }
  }
}
