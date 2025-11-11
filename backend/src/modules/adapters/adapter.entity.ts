import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { MindShardBaseEntity } from "../../common/database/base-model.entity"

@Entity()
export class Adapter extends MindShardBaseEntity {
  // @PrimaryKey()
  // id: string = v4();

  @Property()
  name!: string;

  @Property()
  cid!: string;

  @Property({ nullable: true })
  uploader?: string;

  @Property({ nullable: true })
  manifestHash?: string;

  @Property({ nullable: true })
  license?: string;
}
