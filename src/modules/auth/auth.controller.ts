import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, PayloadDto } from './dto/auth.dto';
import { Public } from 'src/common/decorator/auth.decorator';
import { AuthProfile } from 'src/common/decorator/user.decorator';
import { Roles } from 'src/common/decorator/role.decorator';
import { EnumRole } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Public()
  @Post('login')
  login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }

  @Roles(EnumRole.ADMIN || EnumRole.COMPANY)
  @Get('profile')
  getProfile(@AuthProfile() user: PayloadDto) {
    return this.authService.profile(user.id);
  }
}
