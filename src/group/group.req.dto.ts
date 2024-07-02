import { IsNotEmpty, IsOptional } from 'class-validator';
import { ProductEntity } from 'src/product/product.entity';

export class CreateGroup {
  @IsNotEmpty()
  productId: string;
  @IsOptional()
  product: ProductEntity;
  @IsNotEmpty()
  name: string;
}
