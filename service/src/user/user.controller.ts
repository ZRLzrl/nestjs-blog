import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator.js';
import { QueryUserDto } from './dto/query-user.dto.js';
import { UserService } from './user.service.js';

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: '获取用户列表（管理员）' })
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  @Patch(':id/freeze')
  @Roles('admin')
  @ApiOperation({ summary: '冻结用户（仅限普通用户）' })
  freeze(@Param('id') id: string) {
    return this.userService.freeze(id);
  }

  @Patch(':id/unfreeze')
  @Roles('admin')
  @ApiOperation({ summary: '解冻用户' })
  unfreeze(@Param('id') id: string) {
    return this.userService.unfreeze(id);
  }
}
