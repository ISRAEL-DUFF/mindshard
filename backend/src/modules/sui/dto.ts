import { IsObject, IsString } from "class-validator";

export class VerifyManifestDto {
  manifestJson!: string;
  signature!: string;
  expectedAddress!: string;
}

export class PreparePublishDto {
  cid!: string;
  manifestHash!: string;
  license!: string;
}

export class MintAdapterDto {
    @IsString()
    name: string;
    
    @IsString()
    manifestHash: string;

    @IsString()
    walrusCID: string;

    @IsString()
    signature: string;

    @IsString()
    messageBytesBase64: string;

    @IsString()
    uploaderAddress: string;

    @IsObject()
    manifest: Record<string,any>;
}