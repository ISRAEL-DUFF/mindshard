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
    const adapter = this.adapterRepository.create({
      name: dto.name,
      cid: dto.walrusCID,
      manifestHash: dto.manifestHash,
      license: dto.license,
      uploader: dto.uploaderAddress
    });
    
    await this.em.persistAndFlush(adapter);
    return adapter;
  }

  async findOne(id: string) {
    const adapter = await this.adapterRepository.findOne({ id });
    if (!adapter) throw new NotFoundException('Adapter not found');
    return adapter;
  }
}
