import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
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
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '180d' },
    }),
    forwardRef(() => CategoryModule),
    forwardRef(() => ProductModule),
    AuthModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, S3Service],
  exports: [S3Service, PostRepository],
})
export class PostModule {}
