import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'src/common/decorator/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Public()
  @Post('login')
  login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }

  @Get('profile')
  getProfile(@Request() req) {
    // return this.authService.profile(req.user);
    return req.user
  }
}
