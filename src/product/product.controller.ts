import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { CategoryPagination } from 'src/category/category.req.dto';
import { DataResDto } from 'src/category/category.res.dto';
import { PostRepository } from 'src/post/post.repository';
import {
  CreateProduct,
  PostsByProductPagination,
  Search,
  UpdateProduct,
} from './product.req.dto';
import { ProductService } from './product.service';

@Controller('api/product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly postRepository: PostRepository,
  ) {}
  @Post('create')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addNew(@Body() body: CreateProduct, @UploadedFile() file: any) {
    return await this.productService.addNew(body, file);
  }
  @Put('update/:id')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Body() body: UpdateProduct,
    @Param('id') id: string,
    @UploadedFile() file?: any,
  ) {
    return await this.productService.update(
      { name: body.name, id, slug: body.slug, description: body.description },
      file,
    );
  }
  @Get('getall')
  async getAll(@Query() body: CategoryPagination & Search) {
    return plainToClass(DataResDto, {
      items: await this.productService.search(body),
      count: (await this.productService.getAll(new CategoryPagination()))
        .length,
      page: body.page ?? 0,
      limit: body.limit ?? 0,
    });
  }
  @Get('getposts')
  async getPosts(@Body() body: PostsByProductPagination) {
    return plainToClass(DataResDto, {
      items: await this.productService.findPosts(body),
      count: (await this.postRepository.getAll(new CategoryPagination()))
        .length,
      page: body.page ?? 0,
      limit: body.limit ?? 0,
    });
  }
  @Delete('delete/:id')
  @UseGuards(AuthenticationGuard)
  async delete(@Param('id') id: string) {
    return { success: await this.productService.deleteById(id) };
  }
  @Get('search')
  async search(
    @Query() query: { name?: string; slug?: string } & CategoryPagination,
  ) {
    return plainToClass(DataResDto, {
      items: await this.productService.search(query),
      count: (await this.productService.getAll(new CategoryPagination()))
        .length,
      page: query.page ?? 0,
      limit: query.limit ?? 0,
    });
  }
}
