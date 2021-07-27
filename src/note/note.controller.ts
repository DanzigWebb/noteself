import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Note, NoteDto } from './entity/note.entity';
import { NoteService } from './note.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('note')
export class NoteController {
  constructor(private service: NoteService) {}

  @Post()
  async create(@Body() n: NoteDto): Promise<Note> {
    return this.service.create(n);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getList(@Request() req): Promise<Note[]> {
    const id = req.user.id;
    return await this.service.getListById(id);
  }
}
