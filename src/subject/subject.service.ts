import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NoteSubject, SubjectDto } from './entity/subject.entity';
import { User } from '../user/entity/user.entity';

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

  async getListById(userId: number): Promise<NoteSubject[]> {
    const user = await this.getUserById(userId);
    return await this.subjectRepository.find({
      where: { user },
    });
  }

  private async getUserById(id: number): Promise<User> {
    return await this.userService.findOneById(id);
  }
}
