import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ArticleService } from './article.service.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';
import { QueryArticleDto } from './dto/query-article.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { AuthOptional } from '../common/decorators/auth-optional.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { JwtUser } from '../auth/strategies/jwt.strategy.js';

@ApiTags('文章')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取文章列表（分页）' })
  findAll(@Query() query: QueryArticleDto) {
    return this.articleService.findAll(query);
  }

  @AuthOptional()
  @Get(':id')
  @ApiOperation({ summary: '获取文章详情' })
  findOne(@Param('id') id: string, @CurrentUser() user?: JwtUser | null) {
    return this.articleService.findOne(id, user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布文章' })
  create(@Body() dto: CreateArticleDto, @CurrentUser() user: JwtUser) {
    return this.articleService.create(dto, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '编辑文章' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.articleService.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除文章' })
  delete(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.articleService.delete(id, user);
  }
}
