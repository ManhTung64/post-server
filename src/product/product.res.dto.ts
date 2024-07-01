import { Expose } from 'class-transformer';

@Expose()
export class ProductResDto {
  id: string;
  name: string;
  price: number;
  description: string;
  createAt: Date;
  updateAt: Date;
}
