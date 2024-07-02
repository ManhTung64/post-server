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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { PostRepository } from 'src/post/post.repository';
import {
  CategoryPagination,
  CreateCategory,
  PostsByCategoryPagination,
  UpdateCategory,
} from './category.req.dto';
import { DataResDto } from './category.res.dto';
import { CategoryService } from './category.service';

@Controller('api/category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly postRepository: PostRepository,
  ) {}
  @Post('create')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addNew(
    @Req() req: Request,
    @Body() body: CreateCategory,
    @UploadedFile() file: any,
  ) {
    return await this.categoryService.addNew(body, file);
  }
  @Put('update/:id')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Req() req: Request,
    @Body() body: UpdateCategory,
    @Param('id') id: string,
    @UploadedFile() file?: any,
  ) {
    return await this.categoryService.update({ name: body.name, id }, file);
  }
  @Get('getall')
  async getAll(@Query() body: CategoryPagination) {
    return plainToClass(DataResDto, {
      items: await this.categoryService.getAll(body),
      count: (await this.categoryService.getAll(new CategoryPagination()))
        .length,
      page: body.page ?? 0,
      limit: body.limit ?? 0,
    });
  }
  @Get('search')
  async search(@Query() query: { name: string } & CategoryPagination) {
    return plainToClass(DataResDto, {
      items: await this.categoryService.search(query),
      count: (await this.categoryService.getAll(new CategoryPagination()))
        .length,
      page: query.page ?? 0,
      limit: query.limit ?? 0,
    });
  }
  @Get('getposts')
  async getPosts(@Body() body: PostsByCategoryPagination) {
    return plainToClass(DataResDto, {
      items: await this.categoryService.findPosts(body),
      count: (await this.postRepository.getAll(new CategoryPagination()))
        .length,
      page: body.page ?? 0,
      limit: body.limit ?? 0,
    });
  }
  @Delete('delete/:id')
  @UseGuards(AuthenticationGuard)
  async delete(@Req() req: Request, @Param('id') id: string) {
    return { success: await this.categoryService.deleteById(id) };
  }
}
