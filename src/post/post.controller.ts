import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { Pagination } from 'src/category/category.req.dto';
import {
  CreatePostDto,
  PostsByCategoryAndProduct,
  UpdatePostDto,
} from './post.req.dto';
import { PostService } from './post.service';

@Controller('api/post')
export class PostController {
  constructor(private postService: PostService) {}
  // @Post('create')
  // @UseInterceptors(FilesInterceptor('files'))
  // async createNew(
  //   @Body() post: CreatePostDto,
  //   @UploadedFiles(
  //           new ParseFilePipeBuilder()
  //               .addMaxSizeValidator({ maxSize: 10000000 })
  //               .build({
  //                   errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  //               })
  //       ) files: any[],
  //       @Req() req: Request
  // ){
  //   return (files.length > 0) ? await this.postService.createNew(post, files): await this.postService.createNew(post)
  // }
  @Post('create')
  @UseGuards(AuthenticationGuard)
  async createNew(@Body() post: CreatePostDto, @Req() req: Request) {
    return await this.postService.createNew(post);
  }
  @Put('update')
  @UseGuards(AuthenticationGuard)
  async update(@Body() post: UpdatePostDto, @Req() req: Request) {
    return await this.postService.update(post);
  }
  @Get('get/:id')
  async getPost(@Param('id') id: string) {
    return await this.postService.findOne(id);
  }
  @Get('getall')
  async getAll(@Body() body: Pagination) {
    return await this.postService.getAll(body);
  }
  @Get('byboth')
  async getByCategoryAndProduct(@Body() body: PostsByCategoryAndProduct) {
    return await this.postService.getByCategoryAndProduct(body);
  }
  @Delete('delete/:id')
  @UseGuards(AuthenticationGuard)
  async delete(@Param('id') id: string) {
    return await this.postService.deleteById(id);
  }
}
