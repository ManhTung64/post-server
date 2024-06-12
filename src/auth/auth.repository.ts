import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticationEntity } from './auth.entity';
import { ICreateAccount, ILogin } from './auth.req.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(AuthenticationEntity)
    private authRepository: Repository<AuthenticationEntity>,
  ) {}
  public addNew = async (
    payload: ICreateAccount,
  ): Promise<AuthenticationEntity> => {
    return await this.authRepository.save(payload);
  };
  public findOneByUsername = async (
    payload: ILogin,
  ): Promise<AuthenticationEntity> => {
    return await this.authRepository.findOne({
      where: {
        username: payload.username,
      },
    });
  };
}
