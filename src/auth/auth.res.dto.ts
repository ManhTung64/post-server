import { Expose } from 'class-transformer';

@Expose()
export class AuthResDto {
  username: string;
  token: string;
}
