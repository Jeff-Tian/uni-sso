import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import {
  IEventTrackUrl,
  ITranslation,
  EventReport,
  EventType,
  ICreateEvent,
  Image,
  ICreateEventRestriction,
  EventSegment,
  LoserNotificationStatus,
  EventSelectionStrategy, Simulation,
} from '@hype/hype-shared';
import { SQLEventSegments } from './eventSegments';

@Entity()
export class SQLEvents implements ICreateEvent {
  @PrimaryColumn('uuid')
  public id: string;

  @Column('text')
  public style: string;

  @Column('text')
  public displayName: string;

  @Column('text', { array: true, nullable: false })
  public products: Array<string>;

  @Column('boolean', { nullable: false })
  public isEnabled: boolean;

  @Column('text', { nullable: true })
  public feedBackgroundImageUrl?: string;

  @Column('timestamptz', { nullable: false })
  public eventOpensAt: Date;

  @Column('timestamptz', { nullable: false })
  public eventClosesAt: Date;

  @Column('timestamptz', { nullable: false })
  public countdownStartsAt: Date;

  @Column('timestamptz', { nullable: false })
  public registrationOpensAt: Date;

  @Column('timestamptz', { nullable: false })
  public registrationClosesAt: Date;

  @Column('boolean', { default: false })
  public extendedRegistrationEnabled: boolean;

  @Column('timestamptz', { nullable: true })
  public sendReminderNotificationAt?: Date;

  @Column('boolean', { nullable: true })
  public reminderNotificationsSent: boolean;

  @Column('timestamptz', { nullable: false })
  public drawStartsAt: Date;

  @Column('timestamptz', { nullable: true })
  public drawEndedAt?: Date;

  @Column('text', { array: true, nullable: false })
  public channels: Array<string>;

  @Column('text', { nullable: true })
  public minIosVersion?: string;

  @Column('text', { nullable: true })
  public minAndroidVersion?: string;

  @Column('timestamptz', { nullable: true })
  public createdAt?: Date;

  @Column('timestamptz', { nullable: true })
  public updatedAt?: Date;

  @Column('jsonb', { nullable: true, default: {} })
  public trackingUrls?: Array<IEventTrackUrl>;

  @Column('jsonb', { nullable: true, default: {} })
  public translations?: ITranslation;

  @Column('boolean', { nullable: false })
  public postToFeed?: boolean;

  @Column('jsonb', { nullable: true })
  public lastReport?: EventReport;

  @Column('timestamptz', { nullable: true })
  public lastReportCreationDate?: Date;

  @Column('boolean', { nullable: true })
  public requiresExtendedVerification: boolean;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.Hype,
  })
  public type: EventType;

  @Column('boolean', { nullable: false, default: false })
  public isPlpEnabled: boolean;

  @Column('boolean', { nullable: false, default: false })
  public npsSurveyEnabled: boolean;

  @Column('jsonb', { nullable: true, default: [] })
  public feedImageUrls: Array<Image>;

  @Column('jsonb', { nullable: true, default: [] })
  public plpImageUrls: Array<Image>;

  @Column('text', { nullable: true })
  public pdpDrawMessageKey?: string;

  @Column('boolean', { nullable: true })
  public requiresBoostScore: boolean;

  @Column('jsonb', { nullable: true, default: [] })
  public restrictions?: Array<ICreateEventRestriction>;

  @Column({
    type: 'enum',
    enum: LoserNotificationStatus,
    nullable: true,
  })
  public loserNotificationStatus?: LoserNotificationStatus;

  @Column({
    type: 'enum',
    enum: EventSelectionStrategy,
    default: EventSelectionStrategy.Score,
  })
  public selectionStrategy: EventSelectionStrategy;

  @Column('jsonb', { nullable: true })
  public segmentSimulation?: Simulation;

  @Column('timestamptz', { nullable: true })
  public lastSegmentSimulationCreationDate?: Date;

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(type => SQLEventSegments, eventSegment => eventSegment.event)
  segments: EventSegment[];

}
