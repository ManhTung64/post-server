import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryPagination } from 'src/category/category.req.dto';
import { DeleteResult, Like } from 'typeorm';
import { GroupEntity } from './group.entity';
import { GroupRepository } from './group.repository';
import { CreateGroup } from './group.req.dto';

@Injectable()
export class GroupService {
  constructor(private groupRepository: GroupRepository) {}
  public addNew = async (payload: CreateGroup) => {
    const result: GroupEntity = await this.groupRepository
      .saveChange({
        ...payload,
      })
      .catch((error) => {
        throw new BadRequestException("Category's is exsited or server error");
      });
    return result;
  };
  public update = async (
    payload: Partial<GroupEntity & Pick<GroupEntity, 'id'>>,
  ) => {
    const result: GroupEntity = await this.groupRepository
      .findOneById(payload.id)
      .catch((e) => {
        throw new BadRequestException("Category's is not found");
      });
    const update: GroupEntity = await this.groupRepository
      .saveChange({
        ...result,
        ...payload,
      })
      .catch((error) => {
        throw new BadRequestException(
          "Category's name is exsited or server error",
        );
      });
    return update;
  };
  public getAll = async (payload: CategoryPagination) => {
    const result: GroupEntity[] = await this.groupRepository.getAll(payload);
    return result;
  };
  public getByProduct = async (
    payload: CategoryPagination & { productId: string },
  ) => {
    if (!payload.productId) throw new BadRequestException('Mising productId');
    if (!payload.limit || !payload.page) {
      return await this.groupRepository
        .getAll(new CategoryPagination())
        .catch(() => {
          throw new BadRequestException('Information is invalid');
        });
    } else {
      return await this.groupRepository
        .findBy({
          where: { product: { id: payload.productId } },
          relations: { categories: true },
          skip: (payload.page - 1) * payload.limit,
          take: payload.limit,
        })
        .catch(() => {
          throw new BadRequestException('Information is invalid');
        });
    }
  };
  public deleteById = async (id: string): Promise<boolean> => {
    const result: DeleteResult = await this.groupRepository
      .delete(id)
      .catch(() => {
        throw new BadRequestException('Not found');
      });
    if (result.affected == 1) return true;
    else return false;
  };
  public search = async (
    payload: { name: string } & CategoryPagination,
  ): Promise<GroupEntity[]> => {
    if (!payload.name || !payload.limit) {
      return await this.groupRepository.findBy({
        where: { name: Like(`%${payload.name}%`) },
        relations: { categories: true },
      });
    } else {
      return await this.groupRepository.findBy({
        where: { name: Like(`%${payload.name}%`) },
        skip: (payload.page - 1) * payload.limit,
        take: payload.limit,
        relations: { categories: true },
      });
    }
  };
}
