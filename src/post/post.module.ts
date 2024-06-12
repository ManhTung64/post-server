import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { ProductModule } from 'src/product/product.module';
import { PostController } from './post.controller';
import { PostEntity } from './post.entity';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { S3Service } from './s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    forwardRef(() => CategoryModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, S3Service],
  exports: [S3Service],
})
export class PostModule {}
