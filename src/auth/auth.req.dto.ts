import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ILogin {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
export class ICreateAccount {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
