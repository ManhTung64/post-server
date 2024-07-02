import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryPagination } from 'src/category/category.req.dto';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostsByCategoryAndProduct } from './post.req.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}
  public addNew = async (payload: any) => {
    return await this.postRepository.save(payload);
  };
  public update = async (payload: any) => {
    return await this.postRepository.save({ ...payload });
  };
  public delete = async (id: string) => {
    return await this.postRepository.delete({ id });
  };
  public getAll = async (paginate: any) => {
    return !paginate.page || !paginate.limit
      ? await this.postRepository.find({
          relations: {
            category: true,
            product: true,
          },
          order: {
            createdAt: 'DESC',
          },
        })
      : await this.postRepository.find({
          relations: {
            category: true,
            product: true,
          },
          order: {
            createdAt: 'DESC',
          },
          skip: paginate.limit * (paginate.page - 1),
          take: paginate.limit,
        });
  };
  public findOneById = async (id: string) => {
    return await this.postRepository.findOne({
      where: { id },
      relations: {
        category: true,
        product: true,
      },
    });
  };
  public getAllByCategoryAndProduct = async (
    payload: CategoryPagination & PostsByCategoryAndProduct,
  ) => {
    return !payload.limit || !payload.page
      ? await this.postRepository.find({
          where: {
            product: { id: payload.productId },
            category: { id: payload.categoryId },
          },
          relations: { category: true, product: true },
          order: {
            createdAt: 'DESC',
          },
        })
      : await this.postRepository.find({
          where: {
            product: { id: payload.productId },
            category: { id: payload.categoryId },
          },
          relations: { category: true, product: true },
          order: {
            createdAt: 'DESC',
          },
          skip: payload.limit * (payload.page - 1),
          take: payload.limit,
        });
  };
  public getAllByCategory = async (
    payload: CategoryPagination & PostsByCategoryAndProduct,
  ) => {
    return !payload.limit || !payload.page
      ? await this.postRepository.find({
          where: {
            category: { id: payload.categoryId },
          },
          relations: { category: true, product: true },
          order: {
            createdAt: 'DESC',
          },
        })
      : await this.postRepository.find({
          where: {
            category: { id: payload.categoryId },
          },
          relations: { category: true, product: true },
          order: {
            createdAt: 'DESC',
          },
          skip: payload.limit * (payload.page - 1),
          take: payload.limit,
        });
  };
  public getAllByProduct = async (
    payload: CategoryPagination & PostsByCategoryAndProduct,
  ) => {
    return !payload.limit || !payload.page
      ? await this.postRepository.find({
          where: {
            product: { id: payload.productId },
          },
          relations: { category: true, product: true },
          order: {
            createdAt: 'DESC',
          },
        })
      : await this.postRepository.find({
          where: {
            product: { id: payload.productId },
          },
          relations: { category: true, product: true },
          order: {
            createdAt: 'DESC',
          },
          skip: payload.limit * (payload.page - 1),
          take: payload.limit,
        });
  };
}
