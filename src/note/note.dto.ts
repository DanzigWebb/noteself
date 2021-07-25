export interface NoteDto {
  id: string;
  title: string;
  description: string;
  subject: string;
}

export class NoteModel {
  message: string;
  description: string;
  theme: string;

  constructor(d: NoteDto) {
    Object.assign(this, d);
  }
}
