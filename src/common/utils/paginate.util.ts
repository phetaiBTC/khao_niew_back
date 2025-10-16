import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { OrderBy, PaginateDto, PaginateDtoType } from '../dto/paginate.dto';
import { Pagination } from '../interface/pagination.interface';

export async function paginateUtil<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  options: PaginateDto,
  defaultOrderField: string = 'createdAt',
): Promise<Pagination<T>> {
  const page = options.page && options.page > 0 ? options.page : 1;
  const per_page =
    options.per_page && options.per_page > 0 ? options.per_page : 10;
  qb.orderBy(
    `${qb.alias}.${defaultOrderField}`,
    options.order_by ? options.order_by : OrderBy.DESC,
  );

  if (options.type === PaginateDtoType.ALL) {
    const data = await qb.getMany();
    return {
      data,
      pagination: {
        page: 1,
        per_page: data.length,
        total: data.length,
        total_pages: 1,
      },
    };
  }

  // ✅ ถ้า type = PAGINATE หรือไม่ได้ส่งมา → แบ่งหน้า
  const [data, total] = await qb
    .skip((page - 1) * per_page)
    .take(per_page)
    .getManyAndCount();

  return {
    data,
    pagination: {
      page,
      per_page,
      total,
      total_pages: Math.ceil(total / per_page),
    },
  };
}
