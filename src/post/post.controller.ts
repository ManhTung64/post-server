import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { CategoryPagination } from 'src/category/category.req.dto';
import { DataResDto } from 'src/category/category.res.dto';
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
  async getAll(@Query() body: CategoryPagination) {
    return plainToClass(DataResDto, {
      items: await this.postService.getAll(body),
      count: (await this.postService.getAll(new CategoryPagination())).length,
      page: body.page ?? 0,
      limit: body.limit ?? 0,
    });
  }
  @Get('byboth')
  async getByCategoryAndProduct(
    @Query() params: CategoryPagination & PostsByCategoryAndProduct,
  ) {
    return plainToClass(DataResDto, {
      items: await this.postService.getByCategoryAndProduct(params),
      count: (await this.postService.getAll(new CategoryPagination())).length,
      page: params.page ?? 0,
      limit: params.limit ?? 0,
    });
  }
  @Delete('delete/:id')
  @UseGuards(AuthenticationGuard)
  async delete(@Param('id') id: string) {
    return { success: await this.postService.deleteById(id) };
  }
}
