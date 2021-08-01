import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteSubject } from './entity/subject.entity';
import { UserModule } from '../user/user.module';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { NoteModule } from '../note/note.module';

@Module({
  imports: [TypeOrmModule.forFeature([NoteSubject]), UserModule, NoteModule],
  exports: [TypeOrmModule],
  providers: [SubjectService],
  controllers: [SubjectController],
})
export class SubjectModule {}
