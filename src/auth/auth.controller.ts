import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticationGuard } from './auth.guard';
import { ICreateAccount, ILogin } from './auth.req.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create')
  @UseGuards(AuthenticationGuard)
  async create(@Req() request: Request, @Body() body: ICreateAccount) {
    return await this.authService.createNew(body);
  }
  @Post('login')
  async login(@Req() request: Request, @Body() body: ILogin) {
    return await this.authService.login(body);
  }
  @Get('logout')
  @UseGuards(AuthenticationGuard)
  async logout(@Req() request: Request) {
    return { success: await this.authService.logout(request['token']) };
  }
  // @Get('refreshtoken')
  // async refreshToken(){

  // }
}
