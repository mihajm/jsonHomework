import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateLoggedEventDto } from '../dto/logged-event.dto';

@Entity('event_table')
export class loggedEvent {
  constructor(createLoggedEventDto: CreateLoggedEventDto) {
    this.startTime = new Date();
  }
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