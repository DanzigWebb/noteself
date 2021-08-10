import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Note, NoteDto } from './entity/note.entity';
import { User } from '../user/entity/user.entity';
import { QueryParamsList, NoteQueryParams } from '../utils/query-params';
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

  async create(userId: number, dto: NoteDto): Promise<Note> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    const entity = new Note();
    entity.title = dto.title;
    entity.description = dto.description;
    entity.user = user;

    if (dto.subject) {
      entity.subject = await this.getSubjectById(userId, +dto.subject);
    }

    // const entity = this.noteRepository.create(entity);
    const note = await this.noteRepository.save(entity);
    return note;
  }

  async getOne(userId: number, noteId: number): Promise<Note> {
    const user = await this.getUserById(userId);
    const note = await this.getNoteById(noteId, user);

    return note;
  }

  async getListById(
    userId: number,
    queryParamsList: QueryParamsList,
    noteQueryParams: NoteQueryParams,
  ): Promise<Note[]> {
    const user = await this.getUserById(userId);
    const sort = noteQueryParams.createSort(queryParamsList.params.sort);
    const order = queryParamsList.createOrder(queryParamsList.params.order);
    const search = queryParamsList.params.search || '';

    let notes: Note[];
    try {
      notes = await this.noteRepository.find({
        loadRelationIds: {
          relations: ['subject'],
        },
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
        `Couldn't get a list of Notes: ${e.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return notes;
  }

  async updateByID(
    userId: number,
    noteId: number,
    dto: NoteDto,
  ): Promise<Note> {
    const user = await this.getUserById(userId);
    const entity = await this.getNoteById(noteId, user);

    if (dto.subject) {
      entity.subject = await this.getSubjectById(userId, +dto.subject);
    }

    Object.assign(entity, dto);
    return await this.noteRepository.save(entity);
  }

  async deleteById(userId: number, noteId: number): Promise<Note> {
    const user = await this.getUserById(userId);
    const note = await this.getNoteById(noteId, user);

    try {
      const { affected } = await this.noteRepository.delete(note.id);
      UserService.checkAffected(affected);
    } catch (e) {
      throw new HttpException(
        `Couldn't delete the note: ${e.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return note;
  }

  private async getUserById(id: number): Promise<User> {
    return await this.userService.findOneById(id);
  }
  private async getSubjectById(
    userId: number,
    subjectId: number,
  ): Promise<NoteSubject> {
    try {
      return await this.subjectService.getOne(userId, subjectId);
    } catch (e) {
      throw new HttpException(
        `Couldn't get a subject with id ${subjectId}: ${e.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getNoteById(noteId: number, user: User): Promise<Note> {
    const options = {
      loadRelationIds: {
        relations: ['subject'],
      },
      where: { id: noteId, user },
    };

    try {
      const note = await this.noteRepository.findOne(options);
      NoteService.checkIfNoteExist(note);
      return note;
    } catch (e) {
      throw new HttpException(
        `Couldn't get a note with id: ${noteId}: ${e.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static checkIfNoteExist(note): void {
    if (!note) {
      throw new HttpException(`The Note wasn't found`, HttpStatus.NOT_FOUND);
    }
  }
}
