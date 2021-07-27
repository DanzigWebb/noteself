import { Injectable } from '@nestjs/common';
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

  async create(s: SubjectDto) {
    const user = await this.userService.findOneById(s.user.id);
    const subjectId = await this.noteService.getListById(s.id);
    if (user && subjectId) {
      const subject = new NoteSubject();
      subject.user = s.user;
      subject.title = s.title;
      subject.description = s.description;

      const entity = this.subjectRepository.create(subject);

      await this.subjectRepository.save(entity);
      return subject;
    }
  }
}
