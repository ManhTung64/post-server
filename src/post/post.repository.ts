import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';

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
  public getAllByCategoryAndProduct = async (payload: any) => {
    return await this.postRepository.find({
      where: {
        product: { id: payload.productId },
        category: { id: payload.categoryId },
      },
      relations: { category: true, product: true },
      order: {
        createdAt: 'DESC',
      },
    });
  };
}
