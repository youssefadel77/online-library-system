import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterBooksDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: '50,100' })
  priceRange?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Book1' })
  title?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false, example: '2023-10-01,2023-10-10' })
  releaseDateRange?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Cooking' })
  category?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, example: '1,2,3,4' })
  authors?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, example: 1 })
  page?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, example: 10 })
  limit?: number;
}
