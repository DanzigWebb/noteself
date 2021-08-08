import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Note, NoteDto } from './entity/note.entity';
import { User } from '../user/entity/user.entity';
import { QueryParamsList } from '../utils/query-params';
import { NoteSubject } from '../subject/entity/subject.entity';
import { SubjectService } from '../subject/subject.service';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    private userService: UserService,
    private subjectService: SubjectService,
  ) {}

  async create(userId: number, n: NoteDto): Promise<Note> {
    const user = await this.getUserById(userId);
    let subject: NoteSubject = null;
    if (n.subject) {
      subject = await this.getSubjectById(userId, +n.subject);
    }

    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    const note = new Note();
    note.title = n.title;
    note.description = n.description;
    note.subject = subject;
    note.user = user;

    const entity = this.noteRepository.create(note);
    return await this.noteRepository.save(entity);
  }

  async getOne(userId: number, noteId: number): Promise<NoteDto> {
    const user = await this.getUserById(userId);
    const note = await this.noteRepository.findOne({
      relations: ['subject'],
      where: { id: noteId, user },
    });

    if (!note) {
      throw new HttpException(
        `Not found Note with id: ${noteId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      id: note.id,
      title: note.title,
      subject: note.subject,
      description: note.description,
    };
  }

  async getListById(
    userId: number,
    queryParams: QueryParamsList,
  ): Promise<Note[]> {
    const user = await this.getUserById(userId);

    const search = queryParams.params.search;
    // если параметр не был передан, то возвращаем все subjects этого пользователя
    if (!search) {
      return await this.noteRepository.find({
        where: { user },
      });
    }
    // если параметр передан возвращаем только совпадения по title и description
    // TODO: добавить параметры сортировки
    return await this.noteRepository.find({
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
  private async getSubjectById(
    userId: number,
    subjectId: number,
  ): Promise<NoteSubject> {
    return await this.subjectService.getOne(userId, subjectId);
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

    try {
      await this.noteRepository.delete(note);
    } catch (e) {
      throw new HttpException(
        `Couldn't delete the note: ${e.message}`,
        HttpStatus.FORBIDDEN,
      );
    }
    return note;
  }
}
