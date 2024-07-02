import { CategoryEntity } from 'src/category/category.entity';
import { GroupEntity } from 'src/group/group.entity';
import { ProductEntity } from 'src/product/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class FileUpload {
  field?: string;
  name: string;
  mimetype: string;
  size: number;
  url: string;
}
export class Content {
  files?: FileUpload[];
  content: string;
}
@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-json')
  content: Content;

  @ManyToOne(() => CategoryEntity, (category) => category.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category: CategoryEntity;

  @ManyToOne(() => ProductEntity, (product) => product.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: ProductEntity;

  @ManyToOne(() => GroupEntity, (group) => group.posts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  group: GroupEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
