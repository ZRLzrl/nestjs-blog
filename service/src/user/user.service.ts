import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { User, UserRole } from '../auth/entities/user.entity.js';
import { QueryUserDto } from './dto/query-user.dto.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findAll(query: QueryUserDto) {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const [items, total] = await this.userRepository.findAndCount(
      {},
      {
        orderBy: { createdAt: 'DESC' },
        offset,
        limit,
      },
    );

    return {
      items: items.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        isFrozen: user.isFrozen,
        createdAt: user.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async freeze(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('不能冻结管理员账号');
    }
    user.isFrozen = true;
    await this.userRepository.getEntityManager().flush();
    return { id: user.id, isFrozen: user.isFrozen };
  }

  async unfreeze(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    user.isFrozen = false;
    await this.userRepository.getEntityManager().flush();
    return { id: user.id, isFrozen: user.isFrozen };
  }
}
