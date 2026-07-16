import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InteractionService } from './interaction.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { JwtUser } from '../auth/strategies/jwt.strategy.js';

@ApiTags('互动')
@ApiBearerAuth()
@Controller('articles/:id')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  // ---------- 点赞 ----------

  @Post('likes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '点赞/取消点赞（toggle）' })
  toggleLike(@Param('id') articleId: string, @CurrentUser() user: JwtUser) {
    return this.interactionService.toggleLike(articleId, user);
  }

  // ---------- 评论 ----------

  @Post('comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '发表评论' })
  createComment(
    @Param('id') articleId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.interactionService.createComment(articleId, dto, user);
  }

  @Delete('comments/:commentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除评论' })
  deleteComment(
    @Param('id') articleId: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.interactionService.deleteComment(articleId, commentId, user);
  }
}
