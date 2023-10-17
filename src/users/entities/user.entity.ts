import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from '../../book/entities/book.entity';
import { UserRoleEnum } from '../enums/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
  role?: string;

  @OneToMany(() => Book, (book) => book.author)
  books?: Book[];
}
