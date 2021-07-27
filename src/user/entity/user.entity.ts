import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Note } from '../../note/entity/note.entity';
import { NoteSubject } from '../../subject/entity/subject.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => NoteSubject, (subject) => subject.user)
  subjects: NoteSubject[];

  getInfo(): UserInfoDto {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
    };
  }
}

export interface UserDto {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone?: string;
}

export interface UserInfoDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}
