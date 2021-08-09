import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Note, NoteDto } from './entity/note.entity';
import { NoteService } from './note.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  NoteQueryParams,
  ParamsList,
  QueryParamsList,
  UserQueryParams,
} from '../utils/query-params';

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
  async getList(
    @Request() req,
    @Query() query: Record<ParamsList, string>,
  ): Promise<Note[]> {
    const userId = req.user.id;
    const queryParamsList = new QueryParamsList(query);
    const noteQueryParams = new NoteQueryParams();
    return await this.service.getListById(
      userId,
      queryParamsList,
      noteQueryParams,
    );
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Request() req,
    @Param('id') noteId: string,
  ): Promise<{ message: string; note: Note }> {
    const userId = req.user.id;
    const removedNote = await this.service.deleteById(userId, +noteId);
    return {
      message: 'Note was deleted successfully',
      note: removedNote,
    };
  }
}
