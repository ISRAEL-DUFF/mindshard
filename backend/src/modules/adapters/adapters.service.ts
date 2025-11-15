import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateAdapterDto } from './dto/create-adapter.dto';
import { Adapter } from './adapter.entity';
import { SuiService } from '../sui/sui.service';

@Injectable()
export class AdaptersService {
  constructor(
    @InjectRepository(Adapter)
    private readonly adapterRepository: EntityRepository<Adapter>,
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateAdapterDto) {
    console.log(dto);
    const adapter = this.adapterRepository.create({
      name: dto.name,
      description: dto.description,
      version: dto.version,
      baseModel: dto.baseModel,
      task: dto.task,
      language: dto.language,
      walrusCID: dto.walrusCID,
      manifestHash: dto.manifestHash,
      license: dto.license,
      creator: dto.creator,
      creatorAddress: dto.creatorAddress,
      signature: dto.signature,
      downloads: 0,
      purchases: 0,
      verified: true,
      price: dto.price ?? 0,
      isPrivate: dto.isPrivate,
      tags: dto.tags,
      versions: dto.versions
    });
    
    await this.em.persistAndFlush(adapter);
    return adapter;
  }

  async findOne(id: string) {
    const adapter = await this.adapterRepository.findOne({ id });
    if (!adapter) throw new NotFoundException('Adapter not found');
    return adapter;
  }

  async findAll() {
    return this.adapterRepository.findAll();
  }

  async findWithFilters(params: { q?: string; baseModel?: string; task?: string; sort?: string }) {
    const { q, baseModel, task, sort } = params;
    const where: any = {};
    if (q) {
      // Simple text search on name, creator, baseModel, description
      where.$or = [
        { name: { $ilike: `%${q}%` } },
        { creator: { $ilike: `%${q}%` } },
        { baseModel: { $ilike: `%${q}%` } },
        { description: { $ilike: `%${q}%` } },
      ];
    }
    if (baseModel) where.baseModel = baseModel;
    if (task) where.task = task;

    let orderBy: any = {};
    switch (sort) {
      case 'popular':
        orderBy = { downloads: 'desc', purchases: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      default:
        orderBy = { downloads: 'desc', purchases: 'desc' };
    }

    return this.adapterRepository.find(where, { orderBy });
  }
}

// async findWithFilters({ q, baseModel, task, sort }: { q?: string; baseModel?: string; task?: string; sort?: string }) {
  //   const where: any = {};
  //   if (q) {
  //     // Simple text search on name, creator, baseModel, description
  //     where.$or = [
  //       { name: { $ilike: `%${q}%` } },
  //       { creator: { $ilike: `%${q}%` } },
  //       { baseModel: { $ilike: `%${q}%` } },
  //       { description: { $ilike: `%${q}%` } },
  //     ];
  //   }
  //   if (baseModel) where.baseModel = baseModel;
  //   if (task) where.task = task;

  //   let orderBy: any = {};
  //   switch (sort) {
  //     case 'popular':
  //       orderBy = { downloads: 'desc', purchases: 'desc' };
  //       break;
  //     case 'newest':
  //       orderBy = { createdAt: 'desc' };
  //       break;
  //     case 'price-low':
  //       orderBy = { price: 'asc' };
  //       break;
  //     case 'price-high':
  //       orderBy = { price: 'desc' };
  //       break;
  //     default:
  //       orderBy = { downloads: 'desc', purchases: 'desc' };
  //   }

  //   return this.adapterRepository.find(where, { orderBy });
  // }
