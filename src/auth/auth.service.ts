import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private user: UserService, private jwtService: JwtService) {}

  async validateUser(name: string, pass: string): Promise<User | null> {
    const user = await this.user.findOneByName(name);
    if (user && user.password === pass) {
      return user;
    } else {
      return null;
    }
  }

  async login(user: User) {
    const payload = { username: user.firstName, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
