import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import {
  CategoryPagination,
  CreateCategory,
  PostsByCategoryPagination,
} from './category.req.dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}
  public addNew = async (payload: CreateCategory): Promise<CategoryEntity> => {
    return await this.categoryRepository.save(payload);
  };
  public saveChange = async (
    payload: CategoryEntity,
  ): Promise<CategoryEntity> => await this.categoryRepository.save(payload);
  public delete = async (id: string): Promise<DeleteResult> => {
    return await this.categoryRepository.delete({ id });
  };
  public getAll = async (paginate: CategoryPagination) => {
    return !paginate.limit || !paginate.page
      ? await this.categoryRepository.find({ order: { createdAt: 'DESC' } })
      : await this.categoryRepository.find({
          order: {
            createdAt: 'DESC',
          },
          skip: (paginate.page - 1) * paginate.limit,
          take: paginate.limit,
        });
  };
  public findOneById = async (id: string) => {
    return await this.categoryRepository.findOneBy({ id });
  };
  public findPostsById = async (payload: PostsByCategoryPagination) => {
    try {
      return await this.categoryRepository.find({
        where: { id: payload.id },
        relations: {
          posts: {
            product: true,
          },
        },
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
