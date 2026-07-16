import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../auth/entities/user.entity.js';
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
}
