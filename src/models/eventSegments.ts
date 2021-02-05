import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BucketOperationMode, EventSegment, ICreateEvent, Simulation } from '@hype/hype-shared';
import { SQLSegmentDefinitions } from './segmentDefinitions';
import { SQLEvents } from './events';

@Entity()
export class SQLEventSegments implements EventSegment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int', { nullable: false })
  public priority: number;

  @Column('int', { nullable: true })
  public operationModeValue: number;

  @Column({
    type: 'enum',
    enum: BucketOperationMode,
    nullable: false,
  })
  public operationMode: BucketOperationMode;

  @Column({
    type: 'string',
  })
  eventId: string;

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => SQLEvents, event => event.segments, {
    onDelete: 'CASCADE',
  })
  event: ICreateEvent;

  @Column({
    type: 'integer',
  })
  segmentDefinitionId: number;

  @Column('jsonb', { nullable: true })
  public simulation?: Simulation;

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => SQLSegmentDefinitions, segment => segment.eventSegments, {
    onDelete: 'RESTRICT',
  })
  segmentDefinition: SQLSegmentDefinitions;
}
