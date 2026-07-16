import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
} from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { User } from '../../auth/entities/user.entity.js';
import { Like } from '../../interaction/entities/like.entity.js';
import { Comment } from '../../interaction/entities/comment.entity.js';

@Entity()
export class Article {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property({ length: 200 })
  title!: string;

  @Property({ type: 'text' })
  content!: string;

  @ManyToOne(() => User)
  author!: User;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => Like, (like) => like.article)
  likes = new Collection<Like>(this);

  @OneToMany(() => Comment, (comment) => comment.article)
  comments = new Collection<Comment>(this);
}
