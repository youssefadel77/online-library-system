import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Request() req: any, @Body() data: SignupDto) {
    const user = await this.authService.signup(data);
    return user;
  }

  @Post('login')
  async login(@Request() req: any, @Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.authService.profile(req.user.userId);
  }
}
