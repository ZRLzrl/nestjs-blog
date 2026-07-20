import { Migration } from '@mikro-orm/migrations';

export class Migration20260720101655_AddIsFrozenToUser extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "user" add "is_frozen" boolean not null default false;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user" drop column "is_frozen";`);
  }

}
