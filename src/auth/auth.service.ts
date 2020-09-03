import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from '../contracts/db/user';
import { IUser, LoginResponse } from './user-info';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async findUser(username: string): Promise<User | undefined> {
    return this.userRepo.findOne({ username });
  }

  private static checkPassword(u: User, password: string): boolean {
    // todo: хэш пароля
    return u.password === password;
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<IUser | null> {
    console.log('authService.validateUser', username, password);

    const u = await this.findUser(username);
    if (u && AuthService.checkPassword(u, password)) {
      return { id: u.id, username };
    }

    return null;
  }

  async login(user: IUser): Promise<LoginResponse> {
    console.log('authService.login', JSON.stringify(user));

    const payload: IUser = { id: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
