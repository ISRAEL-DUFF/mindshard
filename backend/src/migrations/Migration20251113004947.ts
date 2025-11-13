import { Migration } from '@mikro-orm/migrations';

export class Migration20251113004947 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop index "adapter_cid_index";`);
    this.addSql(`drop index "adapter_created_at_index";`);
    this.addSql(`drop index "adapter_uploader_index";`);

    this.addSql(`alter table "adapter" add column "updated_at" timestamptz not null, add column "deleted_at" timestamptz null;`);
    this.addSql(`alter table "adapter" alter column "id" drop default;`);
    this.addSql(`alter table "adapter" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "adapter" alter column "id" set default gen_random_uuid();`);
    this.addSql(`alter table "adapter" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "adapter" drop column "updated_at", drop column "deleted_at";`);

    this.addSql(`alter table "adapter" alter column "id" drop default;`);
    this.addSql(`alter table "adapter" alter column "id" drop default;`);
    this.addSql(`alter table "adapter" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "adapter" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));`);
    this.addSql(`create index "adapter_cid_index" on "adapter" ("cid");`);
    this.addSql(`create index "adapter_created_at_index" on "adapter" ("created_at");`);
    this.addSql(`create index "adapter_uploader_index" on "adapter" ("uploader");`);
  }

}
