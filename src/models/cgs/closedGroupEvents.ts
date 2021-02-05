import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ITranslation, EventReport, ClosedGroupEvent, EventType, Image, EventSelectionStrategy } from '@hype/hype-shared';

@Entity()
export class SQLClosedGroupEvents implements ClosedGroupEvent {
  @PrimaryColumn('uuid')
  public id: string;

  @Column('text')
  public style: string;

  @Column('text')
  public displayName: string;

  @Column('text', { array: true, nullable: false })
  public products: Array<string>;

  @Column('boolean', { nullable: false, default: true })
  public isEnabled: boolean;

  @Column('boolean', { nullable: false, default: true })
  public postToFeed: boolean;

  @Column('timestamptz', { nullable: false })
  public startDate: Date;

  @Column('text', { array: true, nullable: false })
  public channels: Array<string>;

  @Column('text', { nullable: true })
  public minIosVersion?: string;

  @Column('text', { nullable: true })
  public minAndroidVersion?: string;

  @Column('timestamptz', { nullable: false })
  public createdAt: Date;

  @Column('timestamptz', { nullable: false })
  public updatedAt: Date;

  @Column('jsonb', { nullable: true, default: {} })
  public translations?: ITranslation;

  @Column('jsonb', { nullable: true })
  public lastReport?: EventReport;

  @Column('timestamptz', { nullable: true })
  public lastReportCreationDate?: Date;

  @Column('int', { nullable: false })
  public batchInterval: number;

  @Column('int', { nullable: true })
  public checkoutMargin?: number;

  @Column('int', { nullable: true })
  public skuReservationDuration?: number;

  @Column('int', { nullable: false })
  public batchSize: number;

  @Column('int', { nullable: true })
  public nextBatchOffset?: number;

  @Column('int', { nullable: true, default: 0 })
  public addressableHoursFrom?: number;

  @Column('int', { nullable: true, default: 24 })
  public addressableHoursTo?: number;

  @Column('int', { nullable: true })
  public purchaseLimit?: number;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.CGS,
  })
  public type: EventType;

  @Column('timestamptz', { nullable: true })
  public latestBatchStartDate?: Date;

  @Column('boolean', { nullable: false, default: false })
  public isPlpEnabled: boolean;

  @Column('jsonb', { nullable: true, default: [] })
  public feedImageUrls: Array<Image>;

  @Column('jsonb', { nullable: true, default: [] })
  public plpImageUrls: Array<Image>;

  @Column('boolean', { nullable: false, default: false })
  public isSecondChance: boolean;

  @Column({
    type: 'enum',
    enum: EventSelectionStrategy,
    default: EventSelectionStrategy.EveryoneWins,
  })
  public selectionStrategy: EventSelectionStrategy;
}
