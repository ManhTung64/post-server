import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import {
  CreateProduct,
  Pagination,
  PostsByProductPagination,
} from './product.req.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}
  public addNew = async (payload: CreateProduct): Promise<ProductEntity> => {
    return await this.productRepository.save(payload);
  };
  public saveChange = async (payload: ProductEntity): Promise<ProductEntity> =>
    await this.productRepository.save(payload);
  public delete = async (id: string) => {
    return await this.productRepository.delete({ id });
  };
  public getAll = async (paginate: Pagination) => {
    return await this.productRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  };
  public findOneById = async (id: string) => {
    return await this.productRepository.findOneBy({ id });
  };
  public findPostsById = async (payload: PostsByProductPagination) => {
    return await this.productRepository.find({
      where: { id: payload.id },
      relations: {
        posts: {
          category: true,
        },
      },
    });
  };
}
