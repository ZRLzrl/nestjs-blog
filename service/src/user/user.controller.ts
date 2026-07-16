import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service.js';
import { QueryUserDto } from './dto/query-user.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';

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
}
