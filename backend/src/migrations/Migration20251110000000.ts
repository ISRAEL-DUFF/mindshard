import { Migration } from '@mikro-orm/migrations';

export class Migration20251110000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "adapter" ("id" uuid not null, "name" varchar(255) not null, "cid" varchar(255) not null, "uploader" varchar(255) null, "manifest_hash" varchar(255) null, "license" varchar(255) null, "created_at" timestamptz(0) not null, constraint "adapter_pkey" primary key ("id"));'
    );

    // Add indexes for common queries
    this.addSql('create index if not exists "adapter_cid_index" on "adapter" ("cid");');
    this.addSql('create index if not exists "adapter_uploader_index" on "adapter" ("uploader");');
    this.addSql('create index if not exists "adapter_created_at_index" on "adapter" ("created_at");');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "adapter_cid_index";');
    this.addSql('drop index if exists "adapter_uploader_index";');
    this.addSql('drop index if exists "adapter_created_at_index";');
    this.addSql('drop table if exists "adapter" cascade;');
  }
}
