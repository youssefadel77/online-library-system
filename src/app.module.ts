import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book/entities/book.entity';
import { User } from './users/entities/user.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      password: 'mypassword',
      username: 'myuser',
      entities: [User, Book],
      database: 'mydatabase',
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([User]),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
