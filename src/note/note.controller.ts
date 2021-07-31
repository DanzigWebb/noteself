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
  async create(@Request() req, @Body() dto: NoteDto): Promise<Note> {
    const userId = req.user.id;
    return this.service.create(userId, dto);
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
    const userId = req.user.id;
    return await this.service.getOne(userId, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Body() dto: NoteDto,
    @Param('id') noteId: string,
  ): Promise<Note> {
    const userId = req.user.id;
    return await this.service.updateByID(userId, +noteId, dto);
  }
}
