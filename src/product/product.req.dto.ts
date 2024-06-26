import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateProduct {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  image?: string;
  @IsOptional()
  description?: string;
}
export class UpdateProduct {
  @IsOptional()
  @IsUUID()
  id: string;
  @IsNotEmpty()
  name?: string;
  @IsOptional()
  image?: string;
  @IsOptional()
  description?: string;
}
export class Pagination {
  page: number = 1;
  limit: number = 10;
}
export class PostsByProductPagination extends Pagination {
  @IsNotEmpty()
  id: string;
}
