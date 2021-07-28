import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { SubjectService } from './subject.service';
import { NoteSubject, SubjectDto } from './entity/subject.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subject')
export class SubjectController {
  constructor(private service: SubjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() dto: SubjectDto): Promise<NoteSubject> {
    try {
      const userId = req.user.id;
      return this.service.create(userId, dto);
    } catch (e) {
      throw e;
    }
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
  @Get()
  async getList(@Request() req): Promise<NoteSubject[]> {
    try {
      const userId = req.user.id;
      return await this.service.getListById(userId);
    } catch (e) {
      throw e;
    }
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
}
