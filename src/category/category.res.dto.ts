import { Expose } from 'class-transformer';
import { CategoryEntity } from './category.entity';

@Expose()
export class CategoryResDto {
  id: string;
  name: string;
  createAt: Date;
  updateAt: Date;
}

@Expose()
export class DataResDto {
  items: CategoryResDto[] | CategoryEntity;
  limit: number;
  page: number;
  count: number;
}
