import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserDto } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: UserDto): Promise<User> {
    const u: User = await this.findOneByEmail(dto.email);

    if (u) {
      throw UserService.createException(
        `User with email ${dto.email} already has`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User();
    user.firstName = u.firstName;
    user.lastName = u.lastName;
    user.password = u.password;
    user.email = u.email;
    user.phone = u.phone;

    const entity = this.usersRepository.create(user);
    await this.usersRepository.save(entity);
    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw UserService.createException('Not Found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  findOneByName(name: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        firstName: name,
      },
    });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  private static createException(
    error: string,
    status: HttpStatus,
  ): HttpException {
    return new HttpException({ status, error }, status);
  }
}
