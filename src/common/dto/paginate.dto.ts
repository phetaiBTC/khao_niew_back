import { Transform, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export enum PaginateDtoType {
    ALL = 'all',
    PAGINATE = 'paginate'
}

export enum OrderBy {
    ASC = 'ASC',
    DESC = 'DESC'
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
    @IsEnum(OrderBy)
    @IsString()
    @Transform(({ value }) => value?.toUpperCase())
    order_by?: OrderBy;

    @IsOptional()
    @IsString()
    search?: string;
}
