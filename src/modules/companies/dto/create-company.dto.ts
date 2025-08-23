import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string
    @IsString()
    @IsOptional()
    contact?: string

    @ValidateNested()
    @Type(() => CreateUserDto)
    user: CreateUserDto;
}
