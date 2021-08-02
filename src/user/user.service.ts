import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserDto } from './entity/user.entity';
import { QueryFailedError, Repository } from 'typeorm';

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

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
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

    // обработка ошибок, если у пользователя есть какие-либо заметки
    // FIXME: 1) Добавить подобный обработчик для subjectNote. 2) Возможно тут мы не хотим выводить ошибку, а вызывать deleteById для всех вложенных элементов
    try {
      await this.usersRepository.delete(userId);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new HttpException(
          `Couldn't delete the user: ${e.message}`,
          HttpStatus.FORBIDDEN,
        );
      }
    }
    return user;
  }
}
