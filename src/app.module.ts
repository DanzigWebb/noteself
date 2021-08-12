import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoteModule } from './note/note.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { Note } from './note/entity/note.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SubjectModule } from './subject/subject.module';
import { NoteSubject } from './subject/entity/subject.entity';

console.log({
  host: '0.0.0.0',
});

@Module({
  imports: [
    NoteModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'noteself',
      password: 'noteself',
      database: 'noteself',
      entities: [User, Note, NoteSubject],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    SubjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
