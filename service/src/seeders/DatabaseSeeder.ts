import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from '../auth/entities/user.entity.js';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const userRepo = em.getRepository(User);

    const hashedPassword = await bcrypt.hash('admin123', 10);
    userRepo.create({
      username: 'admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isFrozen: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userPassword = await bcrypt.hash('user123', 10);
    userRepo.create({
      username: 'testuser',
      password: userPassword,
      role: UserRole.USER,
      isFrozen: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.flush();

    console.log('✅ 默认管理员账号: admin / admin123');
    console.log('✅ 测试普通账号: testuser / user123');
  }
}
