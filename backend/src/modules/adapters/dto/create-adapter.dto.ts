import { IsString, IsOptional } from 'class-validator';

export class CreateAdapterDto {
  @IsString()
  name: string;

  @IsString()
  cid: string;

  @IsString()
  uploaderAddress: string;

  @IsOptional()
  @IsString()
  manifestHash?: string;

  @IsOptional()
  @IsString()
  license?: string;
}
