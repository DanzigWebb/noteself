import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from '../user/user.service';
import { NoteService } from '../note/note.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NoteSubject, SubjectDto } from './entity/subject.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(NoteSubject)
    private subjectRepository: Repository<NoteSubject>,
    private userService: UserService,
    private noteService: NoteService,
  ) {}

  async create(userId: number, s: SubjectDto) {
    const user = await this.userService.findOneById(userId);

    // const subjectId = await this.noteService.getListById(s.id);
    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }
    const subject = new NoteSubject();
    subject.user = user;
    subject.title = s.title;
    subject.description = s.description;

    const entity = this.subjectRepository.create(subject);

    await this.subjectRepository.save(entity);
    return subject

  }
}
