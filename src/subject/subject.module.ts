import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteSubject } from './entity/subject.entity';
import { UserModule } from '../user/user.module';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NoteSubject]), UserModule],
  exports: [TypeOrmModule, SubjectService],
  providers: [SubjectService],
  controllers: [SubjectController],
})
export class SubjectModule {}
