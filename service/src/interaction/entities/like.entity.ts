import { type Rel } from '@mikro-orm/core';
import {
  Entity,
  PrimaryKey,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/decorators/legacy';

import { Article } from '../../article/entities/article.entity.js';
import { User } from '../../auth/entities/user.entity.js';

@Entity()
@Unique({ properties: ['user', 'article'] })
export class Like {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @ManyToOne(() => User)
  user!: Rel<User>;

  @ManyToOne(() => Article)
  article!: Rel<Article>;

  @Property()
  createdAt: Date = new Date();
}
