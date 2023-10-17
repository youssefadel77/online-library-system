import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Book 1' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'book1.com' })
  url: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Cooking' })
  @IsString()
  category: string;

  @IsString()
  @ApiProperty({ example: 50 })
  price: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2023-10-01' })
  releaseDate?: Date;

  @IsNumber()
  authorId: number;
}
