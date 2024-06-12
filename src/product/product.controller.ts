import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import {
  CreateProduct,
  Pagination,
  PostsByProductPagination,
  UpdateProduct,
} from './product.req.dto';
import { ProductService } from './product.service';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
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
    return await this.productService.update({ name: body.name, id }, file);
  }
  @Get('getall')
  async getAll(@Body() body: Pagination) {
    return await this.productService.getAll(body);
  }
  @Get('getposts')
  async getPosts(@Body() body: PostsByProductPagination) {
    return await this.productService.findPosts(body);
  }
  @Delete('delete/:id')
  @UseGuards(AuthenticationGuard)
  async delete(@Param('id') id: string) {
    return await this.productService.deleteById(id);
  }
}
