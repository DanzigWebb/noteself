import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteSubject } from './entity/subject.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([NoteSubject]), UserModule],
  exports: [TypeOrmModule],
})
export class SubjectModule {}
