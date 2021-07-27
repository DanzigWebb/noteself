import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Note, NoteDto } from './entity/note.entity';
import { NoteService } from './note.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('note')
export class NoteController {
  constructor(private service: NoteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() n: NoteDto): Promise<Note> {
    return this.service.create(n);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getList(@Request() req): Promise<Note[]> {
    const userId = req.user.id;
    return await this.service.getListById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user.id;
      return await this.service.getOne(userId, +id);
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Body() dto: NoteDto,
    @Param('id') noteId: string,
  ): Promise<Note> {
    try {
      const userId = req.user.id;
      return await this.service.updateByID(userId, +noteId, dto);
    } catch (e) {
      throw e;
    }
  }
}
