import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserDto } from './entity/user.entity';
import { Like, Repository } from 'typeorm';
import { QueryParamsList } from '../utils/query-params';

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
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.password = dto.password;
    user.email = dto.email;
    user.phone = dto.phone;

    const entity = this.usersRepository.create(user);
    await this.usersRepository.save(entity);
    return user;
  }

  findAll(queryParams: QueryParamsList): Promise<User[]> {
    const search = queryParams.params.search;
    if (!search) {
      return this.usersRepository.find();
    }
    return this.usersRepository.find({
      where: [
        { firstName: Like(`%${search}%`) },
        { lastName: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
      ],
    });
  }

  //fixme: поправить вывод, чтобы он соответствовал интерфейсу UserInfoDto
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

  async deleteById(userId: number): Promise<User> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new HttpException(
        `Not found User with id: ${userId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const { affected } = await this.usersRepository.delete(userId);
      UserService.checkAffected(affected);
    } catch (e) {
      throw new HttpException(
        `Couldn't delete the user: ${e.message}`,
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }

  static checkAffected(affected: number) {
    if (!affected) {
      throw Error(`The row(-s) hasn't changed`);
    }
  }
}
