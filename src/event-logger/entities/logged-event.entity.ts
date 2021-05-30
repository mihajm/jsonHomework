import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event_table')
export class loggedEvent {
  constructor() {
    this.startTime = new Date();
  }
  @Index('EVENT-ID-INDEX')
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: string;

  @Column({ name: 'START_TIME' })
  startTime: Date;

  @Column({ name: 'CONTEXT', nullable: true })
  context: string;

  @Column('json', { name: 'JSON_PAYLOAD', nullable: true })
  payload: string;

  @Column({ name: 'ERROR_MSG', nullable: true })
  errorMsg: string;
}
