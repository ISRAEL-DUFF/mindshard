import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { MindShardBaseEntity } from "../../common/database/base-model.entity"

@Entity()
export class Adapter extends MindShardBaseEntity {
  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  version?: string;

  @Property({ nullable: true })
  baseModel?: string;

  @Property({ nullable: true })
  task?: string;

  @Property({ nullable: true })
  language?: string;

  @Property({ nullable: true })
  license?: string;

  @Property({ nullable: true })
  creator?: string;

  @Property({ nullable: true })
  creatorAddress?: string;

  @Property({ nullable: true })
  manifestHash?: string;

  @Property({ nullable: true })
  walrusCID?: string;

  @Property({ nullable: true })
  signature?: string;

  @Property({ nullable: true })
  downloads?: number;

  @Property({ nullable: true })
  purchases?: number;

  @Property({ nullable: true })
  verified?: boolean;

  @Property({ nullable: true })
  price?: number;

  @Property({ nullable: true })
  isPrivate?: boolean;

  @Property({ type: 'json', nullable: true })
  tags?: string[];

  @Property({ type: 'json', nullable: true })
  versions?: any[];
}

// {
//     id: '1',
//     name: 'GPT-4 Style Adapter',
//     description: 'Fine-tuned adapter for GPT-like writing style with improved coherence',
//     version: '1.0.0',
//     baseModel: 'llama-2-7b',
//     task: 'text-generation',
//     language: 'en',
//     license: 'MIT',
//     creator: 'alice.sui',
//     creatorAddress: '0x123...',
//     manifestHash: '0xabc...',
//     walrusCID: 'walrus://xyz',
//     signature: '0xsig...',
//     createdAt: '2024-01-15',
//     updatedAt: '2024-01-15',
//     downloads: 1234,
//     purchases: 45,
//     verified: true,
//     price: 10,
//     isPrivate: false,
//     tags: ['writing', 'creative', 'text'],
//     versions: [],
//   }
