import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Candidate, CandidateStatus } from '@hype/hype-shared';

@Entity()
@Index([ 'eventId', 'userId' ], { unique: true })
@Index([ 'eventId', 'score', 'status' ])
@Index([ 'userId', 'status' ], { where: `status = 'ACTIVE'` })
@Index([ 'includeInAllBatches', 'status', 'expirationDate' ], { where: `"includeInAllBatches" = false AND status != 'EXPIRED'` })
export class SQLCandidate implements Candidate {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    length: 40,
  })
  public userId: string;

  @Column('uuid', { nullable: false })
  @Index()
  public eventId: string;

  @Column('float', { nullable: false })
  public score: number;

  @Column({
    length: 2,
  })
  public countryCode: string;

  @Column({
    length: 20,
    nullable: true,
  })
  public productId?: string;

  @Column({
    length: 20,
    nullable: true,
  })
  public sku?: string;

  @Column({
    type: 'enum',
    enum: CandidateStatus,
    nullable: false,
    default: CandidateStatus.CREATED,
  })
  public status: CandidateStatus;

  @Index()
  @Column('timestamptz', { nullable: true })
  public expirationDate?: Date;

  @Column('timestamptz', { nullable: false })
  public createdAt: Date;

  @Column('timestamptz', { nullable: false })
  public updatedAt: Date;

  @Column('boolean', { nullable: false, default: false })
  public includeInAllBatches: boolean;

  @Column('int', { nullable: true })
  public batchNumber?: number;
}
