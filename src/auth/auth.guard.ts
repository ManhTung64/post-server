import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenEntity } from './token.entity';
import { TokenRepository } from './token.repository';
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly service: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    const payload = await this.service
      .verifyAsync(token, {
        secret: process.env.TOKEN_SECRET,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });
    // black list
    const exToken: TokenEntity =
      await this.tokenRepository.findOneByToken(token);
    if (!exToken || !exToken.active || exToken.expireAt < new Date())
      throw new UnauthorizedException('Token is invalid');

    request['auth'] = payload;
    request['token'] = token;
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
