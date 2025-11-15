import { Migration } from '@mikro-orm/migrations';

export class Migration20251115140142 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "adapter" drop column "cid";`);

    this.addSql(`alter table "adapter" add column "version" varchar(255) null, add column "base_model" varchar(255) null, add column "task" varchar(255) null, add column "language" varchar(255) null, add column "creator" varchar(255) null, add column "creator_address" varchar(255) null, add column "walrus_cid" varchar(255) null, add column "signature" varchar(255) null, add column "downloads" int null, add column "purchases" int null, add column "verified" boolean null, add column "price" int null, add column "is_private" boolean null, add column "tags" jsonb null, add column "versions" jsonb null;`);
    this.addSql(`alter table "adapter" rename column "uploader" to "description";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "adapter" drop column "version", drop column "base_model", drop column "task", drop column "language", drop column "creator", drop column "creator_address", drop column "walrus_cid", drop column "signature", drop column "downloads", drop column "purchases", drop column "verified", drop column "price", drop column "is_private", drop column "tags", drop column "versions";`);

    this.addSql(`alter table "adapter" add column "cid" varchar(255) not null;`);
    this.addSql(`alter table "adapter" rename column "description" to "uploader";`);
  }

}
