import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User, UserDto, UserInfoDto } from './entity/user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Post()
  async create(@Body() u: UserDto): Promise<User> {
    return await this.service.create(u);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return await this.service.findAll();
  }

  // Todo: вывести в контролеер profile.controller
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserInfoDto | null> {
    const user = await this.service.findOneById(req.user.id);
    return user.getInfo();
  }

  // @Get(':id')
  // async getById(@Param('id') id: string) {
  //   return await this.service.findOneById(+id);
  // }
}
