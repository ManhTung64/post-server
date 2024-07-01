import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { S3Service } from 'src/post/s3.service';
import { DeleteResult } from 'typeorm';
import { CategoryEntity } from './category.entity';
import {
  CategoryPagination,
  CreateCategory,
  PostsByCategoryPagination,
  UpdateCategory,
} from './category.req.dto';
import { CategoryResDto } from './category.res.dto';
import { CategoryRepository } from './catgory.repository';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private s3: S3Service,
  ) {}
  public addNew = async (payload: CreateCategory, file: any) => {
    const url = await this.s3.UploadOneFile(file);
    payload.icon = url;
    const result: CategoryEntity = await this.categoryRepository
      .addNew(payload)
      .catch((error) => {
        throw new BadRequestException("Category's is exsited or server error");
      });
    return plainToClass(CategoryResDto, result);
  };
  public update = async (payload: UpdateCategory, file: any) => {
    const result: CategoryEntity = await this.categoryRepository
      .findOneById(payload.id)
      .catch((e) => {
        throw new BadRequestException("Category's is not found");
      });
    if (file) {
      const url = await this.s3.UploadOneFile(file);
      result.icon = url;
    }
    result.name = payload.name;
    const update: CategoryEntity = await this.categoryRepository
      .saveChange(result)
      .catch((error) => {
        throw new BadRequestException(
          "Category's name is exsited or server error",
        );
      });
    return plainToClass(CategoryResDto, update);
  };
  public getAll = async (payload: CategoryPagination) => {
    const result: CategoryEntity[] =
      await this.categoryRepository.getAll(payload);
    return result;
  };
  public deleteById = async (id: string): Promise<boolean> => {
    const result: DeleteResult = await this.categoryRepository
      .delete(id)
      .catch(() => {
        throw new BadRequestException('Not found');
      });
    if (result.affected == 1) return true;
    else return false;
  };
  public findPosts = async (payload: PostsByCategoryPagination) => {
    const result: CategoryEntity[] = await this.categoryRepository
      .findPostsById(payload)
      .catch(() => {
        throw new BadRequestException('Error');
      });
    return result;
  };
}
