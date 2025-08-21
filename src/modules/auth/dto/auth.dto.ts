import { IsEmail, IsOptional, IsString } from "class-validator";

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
}