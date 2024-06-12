import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { AuthenticationEntity } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { ICreateAccount, ILogin } from './auth.req.dto';
import { AuthResDto } from './auth.res.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private passwordService: PasswordService,
    private service: JwtService,
  ) {}
  public createNew = async (payload: ICreateAccount): Promise<AuthResDto> => {
    payload.password = await this.passwordService.hashPassword(
      payload.password,
    );
    const res: AuthenticationEntity = await this.authRepository
      .addNew(payload)
      .catch(() => {
        throw new BadRequestException('Username is exsited');
      });
    return plainToClass(AuthResDto, res);
  };
  public login = async (payload: ILogin): Promise<AuthResDto> => {
    const user: AuthenticationEntity = await this.authRepository
      .findOneByUsername(payload)
      .catch(() => {
        throw new BadRequestException('Username or password is incorrect');
      });
    if (
      !(await this.passwordService.verifyPassword(
        user.password,
        payload.password,
      ))
    )
      throw new BadRequestException('Username or password is incorrect');
    return plainToClass(AuthResDto, {
      ...user,
      token: await this.createToken(user),
    });
  };
  public async verifyToken(token: string) {
    return await this.service
      .verifyAsync(token, {
        secret: process.env.TOKEN_SECRET,
      })
      .catch(() => {
        return null;
      });
  }
  public async createToken(account: AuthenticationEntity): Promise<string> {
    const tokenData: any = {
      id: account.id,
      username: account.username,
    };
    return await this.service.signAsync(tokenData);
  }
}
