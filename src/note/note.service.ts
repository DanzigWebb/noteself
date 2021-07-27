import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note, NoteDto } from './entity/note.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    private userService: UserService,
  ) {}

  async create(n: NoteDto): Promise<Note> {
    const user = await this.userService.findOneById(n.userId);

    if (user) {
      const note = new Note();
      note.title = n.title;
      note.description = n.description;
      note.subject = n.subject;
      note.user = user;

      const entity = this.noteRepository.create(note);
      await this.noteRepository.save(entity);
      return note;
    }
  }

  async getListById(id: number): Promise<Note[]> {
    const user = await this.userService.findOneById(id);
    return await this.noteRepository.find({
      where: { user },
    });
  }
}
