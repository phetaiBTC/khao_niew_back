import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export enum PaginateDtoType {
    ALL = 'all',
    PAGINATE = 'paginate'
}
export class PaginateDto {
    @IsOptional()
    @IsNumber()
    page: number;
    @IsNumber()
    @IsOptional()
    per_page: number;

    @IsOptional()
    @IsEnum(PaginateDtoType)
    type: PaginateDtoType

    @IsString()
    @IsOptional()
    search: string;
}