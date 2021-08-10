import {
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { NoteSubject } from '../../subject/entity/subject.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => NoteSubject, (subject) => subject.id)
  subject: NoteSubject = null;

  @ManyToOne(() => User, (user) => user.notes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export interface NoteDto {
  title: string;
  description: string;
  subject: number | null;
}
