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
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { CategoryPagination } from 'src/category/category.req.dto';
import { DataResDto } from 'src/category/category.res.dto';
import { GroupEntity } from './group.entity';
import { CreateGroup } from './group.req.dto';
import { GroupService } from './group.service';

@Controller('api/group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @Post('create')
  @UseGuards(AuthenticationGuard)
  async addNew(@Req() req: Request, @Body() body: CreateGroup) {
    return await this.groupService.addNew(body);
  }
  @Put('update/:id')
  @UseGuards(AuthenticationGuard)
  async update(
    @Req() req: Request,
    @Body() body: Partial<GroupEntity> & Pick<GroupEntity, 'id'>,
    @Param('id') id: string,
  ) {
    return await this.groupService.update({ name: body.name, id });
  }
  @Get('getall')
  async getAll(@Query() body: CategoryPagination) {
    return plainToClass(DataResDto, {
      items: await this.groupService.getAll(body),
      count: (await this.groupService.getAll(new CategoryPagination())).length,
      page: body.page ?? 0,
      limit: body.limit ?? 0,
    });
  }
  // @Get('getbyproduct')
  // async getByProduct(
  //   @Query() body: CategoryPagination & { productId: string },
  // ) {
  //   return plainToClass(DataResDto, {
  //     items: await this.groupService.getByProduct(body),
  //     count: (await this.groupService.getAll(new CategoryPagination())).length,
  //     page: body.page ?? 0,
  //     limit: body.limit ?? 0,
  //   });
  // }
  @Get('search')
  async search(@Query() query: { name: string } & CategoryPagination) {
    return plainToClass(DataResDto, {
      items: await this.groupService.search(query),
      count: (await this.groupService.getAll(new CategoryPagination())).length,
      page: query.page ?? 0,
      limit: query.limit ?? 0,
    });
  }
  @Delete('delete/:id')
  @UseGuards(AuthenticationGuard)
  async delete(@Req() req: Request, @Param('id') id: string) {
    return { success: await this.groupService.deleteById(id) };
  }
}
