import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Article } from './entities/article.entity.js';
import { User } from '../auth/entities/user.entity.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';
import { QueryArticleDto } from './dto/query-article.dto.js';
import type { JwtUser } from '../auth/strategies/jwt.strategy.js';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>,
  ) {}

  async findAll(query: QueryArticleDto) {
    const { page = 1, limit = 10, authorId } = query;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (authorId) {
      where.author = authorId;
    }

    const [items, total] = await this.articleRepository.findAndCount(where, {
      populate: ['author'],
      orderBy: { createdAt: 'DESC' },
      offset,
      limit,
    });

    return {
      items: items.map((article) => ({
        id: article.id,
        title: article.title,
        author: {
          id: article.author.id,
          username: article.author.username,
        },
        likeCount: article.likes.count(),
        commentCount: article.comments.count(),
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser?: JwtUser | null) {
    const article = await this.articleRepository.findOne(
      { id },
      { populate: ['author', 'likes', 'comments', 'comments.author'] },
    );
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    const likedByMe = currentUser
      ? article.likes.getItems().some((like) => like.user.id === currentUser.id)
      : false;

    return {
      id: article.id,
      title: article.title,
      content: article.content,
      author: {
        id: article.author.id,
        username: article.author.username,
      },
      likeCount: article.likes.count(),
      likedByMe,
      comments: article.comments
        .getItems()
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((comment) => ({
          id: comment.id,
          content: comment.content,
          author: {
            id: comment.author.id,
            username: comment.author.username,
          },
          createdAt: comment.createdAt,
        })),
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }

  async create(dto: CreateArticleDto, user: JwtUser) {
    const author = this.articleRepository
      .getEntityManager()
      .getReference(User, user.id);
    const article = this.articleRepository.create({
      title: dto.title,
      content: dto.content,
      author,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.articleRepository.getEntityManager().flush();

    return {
      id: article.id,
      title: article.title,
      content: article.content,
      authorId: article.author.id,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }

  async update(id: string, dto: UpdateArticleDto, user: JwtUser) {
    const article = await this.articleRepository.findOne(
      { id },
      { populate: ['author'] },
    );
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    if (article.author.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('没有权限编辑此文章');
    }

    if (dto.title !== undefined) article.title = dto.title;
    if (dto.content !== undefined) article.content = dto.content;

    await this.articleRepository.getEntityManager().flush();

    return {
      id: article.id,
      title: article.title,
      content: article.content,
      authorId: article.author.id,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }

  async delete(id: string, user: JwtUser) {
    const article = await this.articleRepository.findOne(
      { id },
      { populate: ['author'] },
    );
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    if (article.author.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('没有权限删除此文章');
    }

    const em = this.articleRepository.getEntityManager();
    em.remove(article);
    await em.flush();
    return null;
  }
}
