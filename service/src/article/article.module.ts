import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { ArticleController } from './article.controller.js';
import { ArticleService } from './article.service.js';
import { Article } from './entities/article.entity.js';

@Module({
  imports: [MikroOrmModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
