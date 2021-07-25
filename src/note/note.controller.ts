import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { NoteDto } from './note.dto';
import { NOTES_MOCKS } from './note.mock';
import { Response } from 'express';

@Controller('note')
export class NoteController {
  @Post()
  create(@Body() noteDto: NoteDto): NoteDto {
    return noteDto;
  }

  @Get()
  getAll(): NoteDto[] {
    return Object.values(NOTES_MOCKS);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Res() res: Response) {
    const note = NOTES_MOCKS[id];
    if (note) {
      res.json(note);
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }
}
