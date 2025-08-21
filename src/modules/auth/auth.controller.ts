import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, PayloadDto } from './dto/auth.dto';
import { Public } from 'src/common/decorator/auth.decorator';
import { AuthProfile } from 'src/common/decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Public()
  @Post('login')
  login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }

  @Get('profile')
  getProfile(@AuthProfile() user: PayloadDto) {
    return this.authService.profile(user.id);
  }
}
