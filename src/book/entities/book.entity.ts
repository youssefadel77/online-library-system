import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'float', nullable: true })
  price?: number;

  @Column({ type: 'date' })
  releaseDate?: Date;

  @ManyToOne(() => User, (user) => user.books)
  @JoinColumn({ name: 'authorId' })
  author?: User;

  @Column()
  authorId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
