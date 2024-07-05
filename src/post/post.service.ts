import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryEntity } from 'src/category/category.entity';
import { CategoryPagination } from 'src/category/category.req.dto';
import { CategoryRepository } from 'src/category/catgory.repository';
import { GroupEntity } from 'src/group/group.entity';
import { ProductEntity } from 'src/product/product.entity';
import { ProductRepository } from 'src/product/product.repository';
import { Like, Raw } from 'typeorm';
import { PostRepository } from './post.repository';
import {
  CreatePostDto,
  PostsByCategoryAndProduct,
  UpdatePostDto,
} from './post.req.dto';
import { S3Service } from './s3.service';

@Injectable()
export class PostService {
  constructor(
    private categoryRepository: CategoryRepository,
    private productRepository: ProductRepository,
    private postRepository: PostRepository,
    private s3: S3Service,
  ) {}
  // public createNew = async(payload: CreatePostDto, files?: any[])=>{
  //   const [category, product]:[CategoryEntity, ProductEntity] = await Promise.all([
  //     this.categoryRepository.findOneById(payload.categoryId),
  //     this.productRepository.findOneById(payload.productId)
  //   ])
  //   if (!category || !product) throw new BadRequestException('Category or product is invalid')
  //   if (files){
  //     payload.files = []
  //     for (let i = 0; i < files.length; i++){
  //       const url = await this.s3.UploadOneFile(files[i])
  //       payload.files.push({
  //         name: files[i].originalname,
  //         mimetype: files[i].mimetype,
  //         url,
  //         size: files[i].size
  //       })
  //     }
  //   }
  //   return await this.postRepository.addNew({
  //     content:{
  //       content: payload.basecontent,
  //       files:payload.files,
  //     },
  //     product,
  //     category
  //   })
  // }
  public createNew = async (payload: CreatePostDto) => {
    const [category, product]: [CategoryEntity, ProductEntity] =
      await Promise.all([
        this.categoryRepository.findOneById(payload.categoryId),
        this.productRepository.findOneById(payload.productId),
      ]);
    if (!category || !product)
      throw new BadRequestException('Category or product is invalid');
    payload.basecontent = await this.replaceFile(payload.basecontent);
    return await this.postRepository
      .addNew({
        content: {
          content: payload.basecontent,
          files: payload.files,
        },
        title: payload.title,
        product,
        slug: payload.slug,
        category,
        group: { id: payload.groupId } as GroupEntity,
      })
      .catch(() => {
        throw new BadRequestException('Information is invalid');
      });
  };
  public update = async (payload: UpdatePostDto) => {
    const [category, product]: [CategoryEntity, ProductEntity] =
      await Promise.all([
        this.categoryRepository.findOneById(payload.categoryId),
        this.productRepository.findOneById(payload.productId),
      ]);
    if ((payload.categoryId && !category) || (payload.productId && !product))
      throw new BadRequestException('Category or product is invalid');
    const post = await this.postRepository.findOneById(payload.id);
    if (!post) throw new BadRequestException('Post is not found');
    payload.content.content = await this.replaceFile(payload.content.content);
    return await this.postRepository.update({
      ...post,
      category,
      product,
      title: payload.title,
      slug: payload.slug,
      group: { id: payload.groupId } as GroupEntity,
      content: payload.content,
    });
  };
  private replaceFile = async (html: string) => {
    const imgRegex = /<img[^>]+src=['"]([^'"]+)['"][^>]*>/g;

    let updatedHtml = html;

    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      if (src && src.startsWith('data:image')) {
        const base64Data = src.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const imageUrl = await this.s3.UploadOneFile(buffer);
        updatedHtml = updatedHtml.replace(src, `"${imageUrl}"`);
      }
    }

    return updatedHtml;
  };

  public findOne = async (id: string) => {
    return await this.postRepository.findOneById(id);
  };
  public getAll = async (payload: CategoryPagination) => {
    return await this.postRepository.getAll(payload);
  };
  public getByCategoryAndProduct = async (
    payload: CategoryPagination & PostsByCategoryAndProduct,
  ) => {
    const conditions: any = {};

    if (payload.slug) {
      conditions.slug = Like(`${payload.slug}`);
    }
    if (payload.title) {
      conditions.title = Raw(
        (alias) => `(${alias} ILIKE :title1 OR ${alias} ILIKE :title2)`,
        {
          title1: `%${payload.title}%`,
          title2: `%${payload.title.toLowerCase()}%`,
        },
      );
    }
    if (payload.categoryId) {
      conditions.category = { id: payload.categoryId };
    }

    if (payload.productId || payload.productSlug) {
      const productConditions: any = {};
      if (payload.productId) {
        productConditions.id = payload.productId;
      }
      if (payload.productSlug) {
        productConditions.slug = Like(`${payload.productSlug}`);
      }
      conditions.product = productConditions;
    }

    const relations: Record<string, boolean> = {};
    if (payload.includes && payload.includes.includes('category'))
      relations.category = true;

    if (payload.includes && payload.includes.includes('group'))
      relations.group = true;
    if (payload.includes && payload.includes.includes('product'))
      relations.product = true;

    return await this.postRepository.findBy({
      where: conditions,
      relations: relations,
      order: {
        createdAt: 'DESC',
      },
      skip:
        payload.limit && payload.page ? (payload.page - 1) * payload.limit : 0,
      take: payload.limit && payload.page ? payload.limit : 100,
    });
  };
  public deleteById = async (id: string) => {
    const result = await this.postRepository.delete(id).catch((e) => {
      throw new BadRequestException(e.message);
    });
    return result;
  };
}
