import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  subject: string;

  @ManyToOne(() => User, (user) => user.notes)
  user: User;
}

export interface NoteDto {
  userId: number;
  title: string;
  description: string;
  subject: string;
}
