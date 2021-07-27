import { Body, Controller, Post } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { NoteSubject, SubjectDto } from './entity/subject.entity';

@Controller('subject')
export class SubjectController {
  constructor(private service: SubjectService) {}

  @Post()
  async create(@Body() n: SubjectDto): Promise<NoteSubject> {
    return this.service.create(n);
  }
}
