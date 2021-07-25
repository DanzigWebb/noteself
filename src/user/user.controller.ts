import { Body, Controller, Get, Post } from '@nestjs/common';
import { User, UserDto } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Post()
  async create(@Body() u: UserDto): Promise<User> {
    return await this.service.create(u);
  }

  @Get()
  async getAll() {
    return await this.service.findAll();
  }
}
