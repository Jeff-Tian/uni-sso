import { Entity, Column, Index, PrimaryColumn, Unique } from 'typeorm';
import { UserRisk, RiskClassification } from '@hype/hype-shared';

@Entity()
@Index([ 'userId' ])
@Unique([ 'userId' ])
export class SQLUserRisk implements UserRisk {
  @PrimaryColumn({ nullable: false, unique: true })
  public userId: string;

  @Column({ nullable: true })
  public memberId?: string;

  @Column('timestamptz', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  public lastUpdated: Date;

  @Column({
    type: 'enum',
    enum: RiskClassification,
    default: RiskClassification.NO,
  })
  public risk: RiskClassification;

  @Column({ nullable: true })
  public reason?: string;
}
