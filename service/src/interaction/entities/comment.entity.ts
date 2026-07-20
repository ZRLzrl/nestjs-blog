import { type Rel } from '@mikro-orm/core';
// import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from '@mikro-orm/decorators/legacy';

import { Article } from '../../article/entities/article.entity.js';
import { User } from '../../auth/entities/user.entity.js';

@Entity()
export class Comment {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: 'text' })
  content!: string;

  @ManyToOne(() => User)
  author!: Rel<User>;

  @ManyToOne(() => Article)
  article!: Rel<Article>;

  @Property()
  createdAt: Date = new Date();
}
