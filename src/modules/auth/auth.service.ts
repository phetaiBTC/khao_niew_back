import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        readonly usersService: UsersService,
        readonly jwtService: JwtService
    ) { }
    async login(body: AuthDto) {
        const user = await this.usersService.findOneByEmail(body.email)
        const isValid = await bcryptUtil.compare(body.password, user.password)
        if (!isValid) throw new Error('Invalid credentials')
        return {
            access_token: this.jwtService.sign({ id: user.id, username: user.username }),
            role: user.role
        }
    }

    async profile(id: number) {
        const user = await this.usersService.findOne(id)
        return user
    }
}
