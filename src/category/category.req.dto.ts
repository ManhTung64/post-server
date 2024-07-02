import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCategory {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  icon?: string;
  @IsNotEmpty()
  groupId: string;
}
export class UpdateCategory {
  @IsOptional()
  @IsUUID()
  id: string;
  @IsOptional()
  name?: string;
  @IsOptional()
  icon?: string;
  @IsOptional()
  groupId?: string;
}
export class CategoryPagination {
  @IsOptional()
  page: number;
  @IsOptional()
  limit: number;
  @IsOptional()
  includes: string = '';
}
export class Pagination {
  @IsOptional()
  page: number = 1;
  @IsOptional()
  limit: number = 10;
}
export class PostsByCategoryPagination extends Pagination {
  @IsNotEmpty()
  id: string;
}
