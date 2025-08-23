import { Injectable } from '@nestjs/common';
import { AuthDto, PayloadDto } from './dto/auth.dto';
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
        // return user
        const isValid = await bcryptUtil.compare(body.password, user.password)
        if (!isValid) throw new Error('Invalid credentials')
        const payload: PayloadDto = { id: user.id, username: user.username, role: user.role , company: user.companies.id}
        return {
            access_token: this.jwtService.sign(payload),
            role: user.role
        }
    }

    async profile(id: number) {
        const user = await this.usersService.findOne(id)
        return user
    }
}
