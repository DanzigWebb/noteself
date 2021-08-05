import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class NoteSubject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.subjects, {
    onDelete: 'CASCADE',
  })
  user: User;
}

export interface SubjectDto {
  title: string;
  description: string;
}
