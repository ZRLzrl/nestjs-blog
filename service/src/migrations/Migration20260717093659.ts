import { Migration } from '@mikro-orm/migrations';

export class Migration20260717093659 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "user" ("id" uuid not null default gen_random_uuid(), "username" varchar(50) not null, "password" varchar(255) not null, "role" text not null default 'user', "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);

    this.addSql(`create table "article" ("id" uuid not null default gen_random_uuid(), "title" varchar(200) not null, "content" text not null, "author_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`create table "like" ("id" uuid not null default gen_random_uuid(), "user_id" uuid not null, "article_id" uuid not null, "created_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "like" add constraint "like_user_id_article_id_unique" unique ("user_id", "article_id");`);

    this.addSql(`create table "comment" ("id" uuid not null default gen_random_uuid(), "content" text not null, "author_id" uuid not null, "article_id" uuid not null, "created_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`alter table "user" add constraint "user_role_check" check ("role" in ('user', 'admin'));`);

    this.addSql(`alter table "article" add constraint "article_author_id_foreign" foreign key ("author_id") references "user" ("id");`);

    this.addSql(`alter table "like" add constraint "like_user_id_foreign" foreign key ("user_id") references "user" ("id");`);
    this.addSql(`alter table "like" add constraint "like_article_id_foreign" foreign key ("article_id") references "article" ("id");`);

    this.addSql(`alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id");`);
    this.addSql(`alter table "comment" add constraint "comment_article_id_foreign" foreign key ("article_id") references "article" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "article" drop constraint "article_author_id_foreign";`);
    this.addSql(`alter table "like" drop constraint "like_user_id_foreign";`);
    this.addSql(`alter table "comment" drop constraint "comment_author_id_foreign";`);
    this.addSql(`alter table "like" drop constraint "like_article_id_foreign";`);
    this.addSql(`alter table "comment" drop constraint "comment_article_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);
    this.addSql(`drop table if exists "article" cascade;`);
    this.addSql(`drop table if exists "like" cascade;`);
    this.addSql(`drop table if exists "comment" cascade;`);
  }

}
