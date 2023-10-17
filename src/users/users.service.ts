// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from '../auth/dto/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  async createUser(dto: SignupDto): Promise<User> {
    const user = new User();
    user.userName = dto.userName;
    user.email = dto.email;
    user.password = dto.password;
    user.role = dto.role; // Assign the role (can be undefined if not provided)

    return this.userRepository.save(user);
  }
}
