import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { AuthenticationEntity } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { ICreateAccount, ILogin } from './auth.req.dto';
import { AuthResDto } from './auth.res.dto';
import { PasswordService } from './password.service';
import { TokenEntity } from './token.entity';
import { TokenRepository } from './token.repository';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private passwordService: PasswordService,
    private readonly tokenRepository: TokenRepository,
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
  public logout = async (reqToken: string): Promise<boolean> => {
    const token: TokenEntity =
      await this.tokenRepository.findOneByToken(reqToken);
    if (!token) throw new BadRequestException('Token is not exsited');
    if (await this.tokenRepository.saveChange({ ...token, active: false }))
      return true;
    else return false;
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
    const data = await this.service
      .signAsync(tokenData, {
        secret: process.env.TOKEN_SECRET,
      })
      .catch((e) => console.log(e));
    if (!data) throw new BadRequestException('Cannot create token');
    const currentDate = new Date();
    const expireDate = new Date(
      currentDate.getTime() + 180 * 24 * 60 * 60 * 1000,
    );
    await this.tokenRepository.saveChange({
      token: data,
      expireAt: expireDate,
    });
    return data;
  }
}
