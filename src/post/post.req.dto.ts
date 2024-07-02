import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CategoryEntity } from 'src/category/category.entity';
import { ProductEntity } from 'src/product/product.entity';
import { Content, FileUpload } from './post.entity';

export class CreatePostDto {
  @IsOptional()
  content: Content;
  @IsNotEmpty()
  basecontent: string;
  files?: FileUpload[];
  @IsNotEmpty()
  productId: string;
  @IsNotEmpty()
  categoryId: string;
  product?: ProductEntity;
  category?: CategoryEntity;
}
export class UpdatePostDto {
  @IsOptional()
  content?: Content;
  @IsNotEmpty()
  @IsUUID()
  id: string;
  @IsOptional()
  productId?: string;
  @IsOptional()
  categoryId?: string;
}
export class PostsByCategoryAndProduct {
  @IsUUID()
  @IsOptional()
  categoryId: string;
  @IsUUID()
  @IsOptional()
  productId: string;
}
