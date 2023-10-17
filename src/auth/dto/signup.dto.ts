import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../../users/enums/user-role.enum';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Test User' })
  userName: string;

  @IsUrl()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'user@settle.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'user' })
  @IsEnum([UserRoleEnum.USER, UserRoleEnum.AUTHOR])
  role?: string;
}
