import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Manhtung1@',
      database: 'test',
      synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    CategoryModule,
    ProductModule,
    PostModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
