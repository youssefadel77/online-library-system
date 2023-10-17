import { OmitType } from '@nestjs/swagger';
import { SignupDto } from './signup.dto';

export class LoginDto extends OmitType(SignupDto, ['userName']) {}
