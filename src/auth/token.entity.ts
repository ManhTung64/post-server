import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  token: string;

  @Column({ name: 'expire_at' })
  expireAt: Date;

  @Column({ default: true })
  active: boolean;
}
