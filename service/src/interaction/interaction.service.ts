import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Like } from './entities/like.entity.js';
import { Comment } from './entities/comment.entity.js';
import { Article } from '../article/entities/article.entity.js';
import { User } from '../auth/entities/user.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import type { JwtUser } from '../auth/strategies/jwt.strategy.js';

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: EntityRepository<Like>,
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
  ) {}

  // ---------- 点赞 ----------

  async toggleLike(articleId: string, user: JwtUser) {
    const em = this.likeRepository.getEntityManager();

    const article = await em.findOne(Article, articleId);
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    const existing = await this.likeRepository.findOne({
      user: user.id as any,
      article: articleId as any,
    });

    if (existing) {
      em.remove(existing);
      await em.flush();
      const likeCount = await this.likeRepository.count({ article: articleId } as any);
      return { liked: false, likeCount };
    }

    const like = this.likeRepository.create({
      user: em.getReference(User, user.id),
      article: em.getReference(Article, articleId),
      createdAt: new Date(),
    });
    em.persist(like);
    await em.flush();

    const likeCount = await this.likeRepository.count({ article: articleId } as any);
    return { liked: true, likeCount };
  }

  // ---------- 评论 ----------

  async createComment(articleId: string, dto: CreateCommentDto, user: JwtUser) {
    const em = this.commentRepository.getEntityManager();

    const article = await em.findOne(Article, articleId);
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    const comment = this.commentRepository.create({
      content: dto.content,
      author: em.getReference(User, user.id),
      article: em.getReference(Article, articleId),
      createdAt: new Date(),
    });
    em.persist(comment);
    await em.flush();

    return {
      id: comment.id,
      content: comment.content,
      authorId: comment.author.id,
      articleId: comment.article.id,
      createdAt: comment.createdAt,
    };
  }

  async deleteComment(articleId: string, commentId: string, user: JwtUser) {
    const em = this.commentRepository.getEntityManager();

    const article = await em.findOne(Article, articleId);
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    const comment = await this.commentRepository.findOne(
      { id: commentId },
      { populate: ['author'] },
    );
    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    if (comment.author.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('没有权限删除此评论');
    }

    em.remove(comment);
    await em.flush();
    return null;
  }
}
