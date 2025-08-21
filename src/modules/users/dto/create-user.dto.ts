import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EnumRole } from "../entities/user.entity";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsOptional()
    @IsEnum(EnumRole)
    readonly role?: EnumRole;
}
