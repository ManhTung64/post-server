import { Exclude, Expose } from 'class-transformer';

@Expose()
export class PostResDto {
  @Exclude()
  content: string;
}
