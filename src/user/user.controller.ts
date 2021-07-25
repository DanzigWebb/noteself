import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }
}
