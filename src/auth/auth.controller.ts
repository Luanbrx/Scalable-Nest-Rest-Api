import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService
  ) { }

@Post()
signIn(@Body() singInDto: SingInDto) {
  return this.authService.authenticate(singInDto)
}

}
