import { Body, Controller, Post } from '@nestjs/common';
import { Note, NoteDto } from './entity/note.entity';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
  constructor(private service: NoteService) {}

  @Post()
  async create(@Body() n: NoteDto): Promise<Note> {
    return this.service.create(n);
  }
}
