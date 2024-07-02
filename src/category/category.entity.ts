import { GroupEntity } from 'src/group/group.entity';
import { PostEntity } from 'src/post/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  name: string;

  @Column({ nullable: true })
  icon: string;

  @OneToMany(() => PostEntity, (post) => post.category)
  posts: PostEntity[];

  @ManyToOne(() => GroupEntity, (group) => group.categories)
  group: GroupEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
