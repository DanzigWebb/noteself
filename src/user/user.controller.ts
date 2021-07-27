import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
  async create(@Body() u: UserDto): Promise<UserInfoDto> {
    const user: User = await this.service.findOneByEmail(u.email);
    if (user) {
      throw this.createException(
        `User with email ${u.email} already has`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = await this.service.create(u);
    return newUser.getInfo();
  }

  createException(error: string, status: HttpStatus): HttpException {
    return new HttpException({ status, error }, status);
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
