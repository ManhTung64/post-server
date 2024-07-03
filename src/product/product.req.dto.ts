import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateProduct {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  image?: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  slug?: string;
}
export class UpdateProduct {
  @IsOptional()
  @IsUUID()
  id: string;
  @IsOptional()
  name?: string;
  @IsOptional()
  image?: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  slug?: string;
}
export class Pagination {
  page: number = 1;
  limit: number = 10;
}
export class PostsByProductPagination extends Pagination {
  @IsNotEmpty()
  id: string;
}
