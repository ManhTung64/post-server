import { Expose } from 'class-transformer';

@Expose()
export class ProductResDto {
  id: string;
  name: string;
  createAt: Date;
  updateAt: Date;
}
