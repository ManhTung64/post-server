import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from './token.entity';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
  ) {}
  public saveChange = async (
    payload: Partial<TokenEntity>,
  ): Promise<TokenEntity> => {
    return await this.tokenRepository.save(payload);
  };
  public findOneByToken = async (token: string): Promise<TokenEntity> => {
    return await this.tokenRepository.findOne({
      where: {
        token: token,
      },
    });
  };
}
