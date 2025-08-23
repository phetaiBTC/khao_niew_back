import { IsEmail, IsOptional, IsString } from "class-validator";
import { EnumRole } from "src/modules/users/entities/user.entity";

export class AuthDto {
    @IsEmail()
    @IsOptional()
    email: string;
    
    @IsOptional()
    @IsString()
    password: string;
}

export class PayloadDto {
    readonly id: number;
    readonly username: string;
    readonly role: EnumRole;
}