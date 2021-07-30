import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserDto, UserInfoDto } from './entity/user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Post()
  async create(@Body() u: UserDto): Promise<UserInfoDto> {
    const user = await this.service.create(u);
    return user.getInfo();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return await this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserInfoDto> {
    const user = await this.service.findOneById(req.user.id);
    return user.getInfo();
  }

  // @Get(':id')
  // async getById(@Param('id') id: string) {
  //   return await this.service.findOneById(+id);
  // }
}
