import { IsNotEmpty } from 'class-validator';

export class CreateGroup {
  @IsNotEmpty()
  name: string;
}
