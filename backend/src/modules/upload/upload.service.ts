import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  // TODO: implement upload service methods
  async health() { return { ok: true, module: 'upload' }; }
}
