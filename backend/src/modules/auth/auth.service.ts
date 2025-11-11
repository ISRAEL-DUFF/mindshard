import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private users = new Map<string, any>();

  async register(email: string, password: string) {
    // Demo in-memory register
    if (this.users.has(email)) throw new Error('User exists');
    this.users.set(email, { email, password });
    return { ok:true };
  }

  async login(email: string, password: string) {
    const u = this.users.get(email);
    if (!u || u.password !== password) throw new Error('Invalid credentials');
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'demo', { expiresIn: '7d' });
    return { token };
  }
}
