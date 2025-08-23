import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export enum PaginateDtoType {
    ALL = 'all',
    PAGINATE = 'paginate'
}
export class PaginateDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    per_page?: number;

    @IsOptional()
    @IsEnum(PaginateDtoType)
    type?: PaginateDtoType;

    @IsOptional()
    @IsString()
    search?: string;
}
