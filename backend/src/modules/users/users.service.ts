import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  // TODO: implement users service methods
  async health() { return { ok: true, module: 'users' }; }
}
