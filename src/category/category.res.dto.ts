import { Expose } from 'class-transformer';

@Expose()
export class CategoryResDto {
  id: string;
  name: string;
  createAt: Date;
  updateAt: Date;
}
