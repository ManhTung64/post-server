import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { ProductModule } from './product/product.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://default:ZLcmK2waEuT5@ep-gentle-snowflake-a1702gjn.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require',
      // host: 'localhost',
      // port: 5432,
      // username: 'postgres',
      // password: 'Manhtung1@',
      // database: 'test',
      synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    CategoryModule,
    ProductModule,
    PostModule,
    AuthModule,
    GroupModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
