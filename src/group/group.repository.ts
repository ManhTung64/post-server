import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryPagination } from 'src/category/category.req.dto';
import { Repository } from 'typeorm';
import { GroupEntity } from './group.entity';
// import { PostsByProductPagination } from './product.req.dto';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
  ) {}
  public saveChange = async (
    payload: Partial<GroupEntity>,
  ): Promise<GroupEntity> => await this.groupRepository.save(payload);
  public getAll = async (
    payload: CategoryPagination,
  ): Promise<GroupEntity[]> => {
    if (!payload.limit || !payload.page) {
      return await this.groupRepository.find({
        // relations: { categories: true },
      });
    }
    return await this.groupRepository.find({
      // relations: { categories: true },
      skip: payload.limit * (payload.page - 1),
      take: payload.limit,
    });
  };
  public delete = async (id: string) => {
    return await this.groupRepository.delete({ id });
  };
  public getByProductId = async (productId: string) => {
    return await this.groupRepository.find({
      // where: { product: { id: productId } },
      order: {
        createdAt: 'DESC',
      },
    });
  };
  public findOneById = async (id: string) => {
    return await this.groupRepository.findOneBy({ id });
  };
  public findBy = async (arg: any) => {
    return await this.groupRepository.findBy(arg);
  };
}
