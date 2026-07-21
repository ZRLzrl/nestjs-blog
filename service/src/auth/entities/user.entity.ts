import { Collection } from '@mikro-orm/core';
import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  OneToMany,
} from '@mikro-orm/decorators/legacy';

import { Article } from '../../article/entities/article.entity.js';
import { Comment } from '../../interaction/entities/comment.entity.js';
import { Like } from '../../interaction/entities/like.entity.js';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ length: 50, unique: true })
  username!: string;

  @Property({ length: 255, hidden: true })
  password!: string;

  @Enum(() => UserRole)
  role: UserRole = UserRole.USER;

  @Property({ default: false })
  isFrozen: boolean = false;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => Article, (article) => article.author)
  articles = new Collection<Article>(this);

  @OneToMany(() => Like, (like) => like.user)
  likes = new Collection<Like>(this);

  @OneToMany(() => Comment, (comment) => comment.author)
  comments = new Collection<Comment>(this);
}
