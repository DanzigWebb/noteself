import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note, NoteDto } from './entity/note.entity';
import { User } from '../user/entity/user.entity';

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

  async getOne(userId: number, noteId: number): Promise<Note | null> {
    const user = await this.getUserById(userId);
    const note = await this.noteRepository.findOne({
      where: { id: noteId, user },
    });

    return note || null;
  }

  async getListById(userId: number): Promise<Note[]> {
    const user = await this.getUserById(userId);
    return await this.noteRepository.find({
      where: { user },
    });
  }

  async updateByID(id: number, newValue: NoteDto): Promise<Note> {
    const note = await this.noteRepository.findOne({ where: { id } });
    Object.assign(note, newValue);
    await this.noteRepository.save(note);
    return note;
  }

  private async getUserById(id: number): Promise<User> {
    return await this.userService.findOneById(id);
  }
}
