import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthenticationEntity } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { TokenEntity } from './token.entity';
import { TokenRepository } from './token.repository';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '180d' },
    }),
    TypeOrmModule.forFeature([AuthenticationEntity, TokenEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PasswordService,
    TokenRepository,
    // AuthenticationGuard,
  ],
  exports: [TokenRepository],
})
export class AuthModule {}
