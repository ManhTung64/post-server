import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryPagination } from 'src/category/category.req.dto';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CreateProduct, PostsByProductPagination } from './product.req.dto';

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
  public getAll = async (paginate: CategoryPagination) => {
    return !paginate.limit || !paginate.page
      ? await this.productRepository.find({
          order: {
            createdAt: 'DESC',
          },
        })
      : await this.productRepository.find({
          order: {
            createdAt: 'DESC',
          },
          skip: paginate.limit * (paginate.page - 1),
          take: paginate.limit,
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
  public findBy = async (arg: any): Promise<ProductEntity[]> => {
    return await this.productRepository.find(arg);
  };
}
