import { GroupEntity } from 'src/group/group.entity';
import { PostEntity } from 'src/post/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  name: string;

  @Column('varchar', { nullable: true, default: '' })
  description: string;

  @OneToMany(() => PostEntity, (post) => post.product)
  posts: PostEntity[];

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => GroupEntity, (group) => group.product)
  groups: GroupEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
