import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import {
  CreateCategory,
  Pagination,
  PostsByCategoryPagination,
  UpdateCategory,
} from './category.req.dto';
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
  async getAll(@Body() body: Pagination) {
    return await this.categoryService.getAll(body);
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
