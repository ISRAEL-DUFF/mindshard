import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.svc.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.svc.login(body.email, body.password);
  }
}
