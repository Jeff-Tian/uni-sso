import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EventSegment, SegmentDefinition, SelectionCriteria } from '@hype/hype-shared';
import { SQLEventSegments } from './eventSegments';

@Entity()
export class SQLSegmentDefinitions implements SegmentDefinition {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    nullable: false,
  })
  public translatedSelectionCriteria: string;

  @Column('jsonb', {
    nullable: false,
  })
  public selectionCriteria: Array<SelectionCriteria>;

  @Column({
    nullable: false,
  })
  public name: string;

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(type => SQLEventSegments, segment => segment.segmentDefinition)
  eventSegments: EventSegment[];
}
