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
            category: paginate.includes.includes('category'),
            group: paginate.includes.includes('group'),
            product: paginate.includes.includes('product') ? true : false,
          },
          order: {
            createdAt: 'DESC',
          },
        })
      : await this.postRepository.find({
          relations: {
            category: paginate.includes.includes('category'),
            group: paginate.includes.includes('group'),
            product: paginate.includes.includes('product') ? true : false,
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
        group: true,
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
            group: { id: payload.groupId },
          },
          relations: {
            category: payload.includes.includes('category'),
            group: payload.includes.includes('group'),
            product: payload.includes.includes('product') ? true : false,
          },
          order: {
            createdAt: 'DESC',
          },
        })
      : await this.postRepository.find({
          where: {
            product: { id: payload.productId },
            category: { id: payload.categoryId },
            group: { id: payload.groupId },
          },
          relations: {
            category: payload.includes.includes('category'),
            group: payload.includes.includes('group'),
            product: payload.includes.includes('product') ? true : false,
          },
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
          relations: {
            category: payload.includes.includes('category'),
            group: payload.includes.includes('group'),
            product: payload.includes.includes('product') ? true : false,
          },
          order: {
            createdAt: 'DESC',
          },
        })
      : await this.postRepository.find({
          where: {
            category: { id: payload.categoryId },
          },
          relations: {
            category: payload.includes.includes('category'),
            group: payload.includes.includes('group'),
            product: payload.includes.includes('product') ? true : false,
          },
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
          relations: {
            category: payload.includes.includes('category'),
            group: payload.includes.includes('group'),
            product: payload.includes.includes('product') ? true : false,
          },
          order: {
            createdAt: 'DESC',
          },
        })
      : await this.postRepository.find({
          where: {
            product: { id: payload.productId },
          },
          relations: {
            category: payload.includes.includes('category'),
            group: payload.includes.includes('group'),
            product: payload.includes.includes('product') ? true : false,
          },
          order: {
            createdAt: 'DESC',
          },
          skip: payload.limit * (payload.page - 1),
          take: payload.limit,
        });
  };
  public findBy = async (arg: any) => {
    return await this.postRepository.find(arg);
  };
}
