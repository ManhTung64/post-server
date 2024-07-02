import { CategoryEntity } from 'src/category/category.entity';
import { ProductEntity } from 'src/product/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @ManyToOne(() => ProductEntity, (product) => product.groups, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  @OneToMany(() => CategoryEntity, (category) => category.group, {
    nullable: true,
  })
  categories: CategoryEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
