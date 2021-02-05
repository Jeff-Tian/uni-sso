import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ClosedGroupBatchStatistics } from '../../services/events/models';

@Entity()
export class SQLClosedGroupBatchStatistics implements ClosedGroupBatchStatistics {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('uuid', { nullable: false })
  public eventId: string;

  @Column('int', { nullable: false })
  public batchNumber: number;

  @Column('timestamptz', { nullable: false })
  public startDate: Date;

  @Column('timestamptz', { nullable: false })
  public endDate: Date;
}
