import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  public delete = async (id: string) => {
    return await this.groupRepository.delete({ id });
  };
  public getByProductId = async (productId: string) => {
    return await this.groupRepository.find({
      where: { product: { id: productId } },
      order: {
        createdAt: 'DESC',
      },
    });
  };
  public findOneById = async (id: string) => {
    return await this.groupRepository.findOneBy({ id });
  };
}
