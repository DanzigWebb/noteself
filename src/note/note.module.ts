import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entity/note.entity';
import { UserModule } from '../user/user.module';
import { SubjectModule } from '../subject/subject.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), UserModule, SubjectModule],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [TypeOrmModule],
})
export class NoteModule {}
