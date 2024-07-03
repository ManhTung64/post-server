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
  @IsNotEmpty()
  groupId: string;
  @IsOptional()
  product?: ProductEntity;
  @IsOptional()
  category?: CategoryEntity;
  @IsOptional()
  slug?: string;
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
  @IsOptional()
  groupId?: string;
  @IsOptional()
  slug?: string;
}
export class PostsByCategoryAndProduct {
  @IsUUID()
  @IsOptional()
  categoryId: string;
  @IsUUID()
  @IsOptional()
  productId: string;
  @IsUUID()
  @IsOptional()
  groupId: string;
  @IsOptional()
  getContent: boolean = false;
  @IsOptional()
  slug: string;
}
