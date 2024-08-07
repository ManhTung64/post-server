import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CategoryPagination } from 'src/category/category.req.dto';
import { S3Service } from 'src/post/s3.service';
import { DeleteResult, Like } from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repository';
import {
  CreateProduct,
  PostsByProductPagination,
  Search,
  UpdateProduct,
} from './product.req.dto';
import { ProductResDto } from './product.res.dto';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private s3: S3Service,
  ) {}
  public addNew = async (payload: CreateProduct, file: any) => {
    payload.image = await this.s3.UploadOneFile(file);
    const result: ProductEntity = await this.productRepository
      .addNew(payload)
      .catch((error) => {
        console.log(error);
        throw new BadRequestException('Information is invalid');
      });
    return plainToClass(ProductResDto, result);
  };
  public update = async (payload: UpdateProduct, file: any) => {
    const result: ProductEntity = await this.productRepository
      .findOneById(payload.id)
      .catch((e) => {
        throw new BadRequestException('Information is invalid');
      });
    if (file) {
      result.image = await this.s3.UploadOneFile(file);
    }
    result.name = payload.name;
    result.slug = payload.slug;
    console.log(result);
    const update: ProductEntity = await this.productRepository
      .saveChange(result)
      .catch((error) => {
        throw new BadRequestException('Information is invalid or exsited');
      });
    return plainToClass(ProductResDto, update);
  };
  public getAll = async (payload: CategoryPagination & Search) => {
    const result: ProductEntity[] = await this.productRepository.findBy({
      where: [
        { name: Like(`%${payload.name}%`) },
        { slug: Like(`%${payload.slug}%`) },
      ],
    });
    return result;
  };
  public deleteById = async (id: string): Promise<boolean> => {
    const result: DeleteResult = await this.productRepository
      .delete(id)
      .catch(() => {
        throw new BadRequestException('Not found');
      });
    if (result.affected == 1) return true;
    else return false;
  };
  public findPosts = async (payload: PostsByProductPagination) => {
    const result: ProductEntity[] = await this.productRepository
      .findPostsById(payload)
      .catch((e) => {
        console.log(e);
        throw new BadRequestException('Error');
      });
    return result;
  };
  public search = async (
    payload: { name?: string; slug?: string } & CategoryPagination,
  ): Promise<ProductEntity[]> => {
    console.log(payload.name ?? '', payload.slug);
    const conditions: any = {};
    if (payload.name) conditions.name = Like(`%${payload.name}}%`);
    if (payload.slug) conditions.slug = Like(`%${payload.slug}}%`);

    if (!payload.name || !payload.limit) {
      return await this.productRepository.findBy({
        where: conditions,
      });
    } else {
      return await this.productRepository.findBy({
        where: conditions,
        skip: (payload.page - 1) * payload.limit,
        take: payload.limit,
      });
    }
  };
}
