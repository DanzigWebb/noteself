import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { NoteSubject, SubjectDto } from './entity/subject.entity';
import { User } from '../user/entity/user.entity';
import { QueryParamsList } from '../utils/query-params';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(NoteSubject)
    private subjectRepository: Repository<NoteSubject>,
    private userService: UserService,
  ) {}

  async create(userId: number, s: SubjectDto) {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }
    const subject = new NoteSubject();
    subject.user = user;
    subject.title = s.title;
    subject.description = s.description;

    const entity = this.subjectRepository.create(subject);
    return this.subjectRepository.save(entity);
  }

  async getOne(userId: number, subjectId: number): Promise<NoteSubject | null> {
    const user = await this.getUserById(userId);
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId, user },
    });
    if (!subject) {
      throw new HttpException(
        `Not found Subject with id: ${subjectId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return subject;
  }

  async updateById(
    userId: number,
    subjectId: number,
    dto: SubjectDto,
  ): Promise<NoteSubject> {
    const user = await this.getUserById(userId);
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId, user },
    });

    if (!subject) {
      const message = `Not found Subject with id: ${subjectId}`;
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }

    Object.assign(subject, dto);
    await this.subjectRepository.save(subject);
    return subject;
  }

  async deleteById(userId: number, subjectId: number): Promise<NoteSubject> {
    const user = await this.getUserById(userId);
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId, user },
    });

    if (!subject) {
      const message = `Not found Subject with id: ${subjectId}`;
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }

    try {
      await this.subjectRepository.delete(subject);
    } catch (e) {
      throw new HttpException(
        `Couldn't delete the subject: ${e.message}`,
        HttpStatus.FORBIDDEN,
      );
    }
    return subject;
  }

  async getList(
    userId: number,
    queryParams: QueryParamsList,
  ): Promise<NoteSubject[]> {
    const user = await this.getUserById(userId);

    const search = queryParams.params.search || '';
    const sort = queryParams.createSort(queryParams.params.sort);
    const order = queryParams.createOrder(queryParams.params.order);

    let result;
    try {
      result = await this.subjectRepository.find({
        where: [
          {
            title: Like(`%${search}%`),
            user,
          },
          {
            description: Like(`%${search}%`),
            user,
          },
        ],
        order: {
          [sort]: order,
        },
      });
    } catch (e) {
      throw new HttpException(
        `Couldn't get a list of Subjects: ${e.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return result;
  }

  private async getUserById(id: number): Promise<User> {
    return await this.userService.findOneById(id);
  }
}
