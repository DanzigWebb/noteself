import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async create(userId: number, n: NoteDto): Promise<Note> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    const note = new Note();
    note.title = n.title;
    note.description = n.description;
    note.subject = n.subject;
    note.user = user;

    const entity = this.noteRepository.create(note);
    return await this.noteRepository.save(entity);
  }

  async getOne(userId: number, noteId: number): Promise<Note | null> {
    const user = await this.getUserById(userId);
    const note = await this.noteRepository.findOne({
      where: { id: noteId, user },
    });

    if (!note) {
      throw new HttpException(
        `Not found Note with id: ${noteId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return note;
  }

  async getListById(userId: number): Promise<Note[]> {
    const user = await this.getUserById(userId);
    return await this.noteRepository.find({
      where: { user },
    });
  }

  async updateByID(
    userId: number,
    noteId: number,
    dto: NoteDto,
  ): Promise<Note> {
    const user = await this.getUserById(userId);
    const note = await this.noteRepository.findOne({
      where: { id: noteId, user },
    });

    if (!note) {
      const message = `Not found Note with id: ${noteId}`;
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }

    Object.assign(note, dto);
    await this.noteRepository.save(note);
    return note;
  }

  private async getUserById(id: number): Promise<User> {
    return await this.userService.findOneById(id);
  }
  async deleteById(userId: number, noteId: number): Promise<Note> {
    const user = await this.getUserById(userId);
    const note = await this.noteRepository.findOne({
      where: { id: noteId, user },
    });

    if (!note) {
      const message = `Not found Note with id: ${noteId}`;
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }

    await this.noteRepository.delete(note);
    return note;
  }
}
