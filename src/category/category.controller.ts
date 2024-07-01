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
  constructor(private readonly categoryService: CategoryService) {}
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
  @Get('getposts')
  async getPosts(@Body() body: PostsByCategoryPagination) {
    return await this.categoryService.findPosts(body);
  }
  @Delete('delete/:id')
  @UseGuards(AuthenticationGuard)
  async delete(@Req() req: Request, @Param('id') id: string) {
    return await this.categoryService.deleteById(id);
  }
}
