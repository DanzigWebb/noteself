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
import { SubjectService } from './subject.service';
import { NoteSubject, SubjectDto } from './entity/subject.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParamsList, QueryParamsList } from '../utils/query-params';

@Controller('subject')
export class SubjectController {
  constructor(private service: SubjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() dto: SubjectDto): Promise<NoteSubject> {
    const userId = req.user.id;
    return this.service.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return await this.service.getOne(userId, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getList(
    @Request() req,
    @Query() query: Record<ParamsList, string>,
  ): Promise<NoteSubject[]> {
    const userId = req.user.id;
    const queryParams = new QueryParamsList(query);
    return await this.service.getList(userId, queryParams);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Body() dto: SubjectDto,
    @Param('id') subjectId: string,
  ): Promise<NoteSubject> {
    const userId = req.user.id;
    return await this.service.updateById(userId, +subjectId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Request() req,
    @Param('id') subjectId: string,
  ): Promise<{ message: string; subject: NoteSubject }> {
    const userId = req.user.id;
    const removedSubject = await this.service.deleteById(userId, +subjectId);
    return {
      message: `Subject was deleted successfully`,
      subject: removedSubject,
    };
  }
}
