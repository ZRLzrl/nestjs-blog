import { Migration } from '@mikro-orm/migrations';

export class Migration20260721093002 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "user" alter column "username" type varchar(30) using ("username"::varchar(30));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user" alter column "username" type varchar(50) using ("username"::varchar(50));`);
  }

}
