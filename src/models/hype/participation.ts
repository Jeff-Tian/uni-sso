import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import {
  ParticipationStatus,
  OrderCancellationReason,
  PaymentResponse,
  Participation,
  Order,
  PaymentTransaction,
  EventChannel,
  KeyCity,
  ParticipationDryRunStatus,
} from '@hype/hype-shared';
import { PaymentFailureCategory } from '@hype/hype-shared';
import { DeviceInfo } from 'hero-common-gw';

@Entity()
@Index([ 'eventId', 'userId' ])
@Index([ 'eventId', 'userId', 'productId' ], { unique: true })
export class SQLParticipation implements Participation {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('float', { nullable: true })
  public riskScore?: number;

  @Column('float', { nullable: true })
  public dynamicsScore?: number;

  @Column('float', { nullable: true })
  public cancelScore?: number;

  @Column('float', { nullable: true })
  public returnScore?: number;

  @Column('float', { nullable: true })
  public cancellationRate?: number;

  @Column('float', { nullable: true })
  public returnRate?: number;

  @Column('float', { nullable: true })
  public manualScore?: number;

  @Column('float', { nullable: true })
  public randomFactor?: number;

  @Column('float', { nullable: true })
  public score?: number;

  @Column('float', { nullable: true })
  public penalty?: number;

  @Column('int', { nullable: true })
  public memberTier?: number;

  @Column({ nullable: true })
  public dynamicsMemberId?: string;

  @Column('boolean', { nullable: false, default: false })
  public lost: boolean;

  @Column('boolean', { nullable: true })
  public loserNotificationSent?: boolean;

  @Column('boolean', { nullable: true })
  public reminderNotificationSent?: boolean;

  @Column({ nullable: true })
  public displaySize?: string;

  @Column('uuid', { nullable: false })
  public eventId: string;

  @Column({
    length: 20,
  })
  public sku: string;

  @Column({
    length: 2,
  })
  public countryCode: string;

  @Column({
    length: 2,
  })
  public languageCode: string;

  @Column({
    length: 40,
  })
  public userId: string;

  @Column({
    type: 'enum',
    enum: ParticipationStatus,
    default: ParticipationStatus.PENDING,
  })
  public status: ParticipationStatus;

  @Column('bool', { nullable: true })
  public probablyFraudulent: boolean;

  @Column('float', { nullable: true })
  public originalScore: number;

  @Column('timestamptz', { nullable: true })
  public orderedAt?: Date;

  @Column('timestamptz', { nullable: true })
  public registeredAt?: Date;

  @Column('jsonb', { nullable: true })
  public paymentTransactions: Array<PaymentTransaction>;

  @Column('jsonb', { nullable: true })
  public order: Order;

  @Column('jsonb', { nullable: true })
  public storedAuthorizationPaymentResponse?: PaymentResponse;

  @Column('jsonb', { nullable: true })
  public storedRedirectPaymentResponse?: PaymentResponse;

  @Column({ nullable: true })
  @Index()
  public orderId?: string;

  @Column({ nullable: true })
  public basketId?: string;

  @Column('timestamptz', { nullable: true })
  public scoredAt?: Date;

  @Column({ nullable: true })
  public paymentErrorMessage?: string;

  @Column({
    type: 'enum',
    enum: PaymentFailureCategory,
    default: null,
  })
  public paymentFailureCategory?: PaymentFailureCategory;

  @Column({ nullable: true })
  public memberId?: string;

  @Column({ nullable: true })
  public itemId?: string;

  @Column({ nullable: false })
  public productId: string;

  @Column({ nullable: true })
  public subOrdinate?: string;

  @Column({ nullable: true })
  public inventoryId?: string;

  @Column({ nullable: true })
  public orderCancellationReason?: OrderCancellationReason;

  @Column({
    type: 'enum',
    enum: EventChannel,
    default: EventChannel.AdidasApp,
  })
  public channel: EventChannel;

  @Column({
    type: 'enum',
    enum: KeyCity,
    nullable: true,
  })
  public keyCity?: KeyCity;

  @Column('boolean', { nullable: false, default: false })
  public pendingStockReserved: boolean;

  @Column({
    length: 45,
    nullable: true,
  })
  public userIPAddress?: string;

  @Column('jsonb', { nullable: true })
  public userDeviceInfo?: DeviceInfo;

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  public anonymised: boolean;

  @Column('boolean', { nullable: false, default: false })
  public additionalDataFetched: boolean;

  @Column({
    type: 'enum',
    enum: ParticipationDryRunStatus,
    nullable: true,
  })
  public dryRunStatus?: ParticipationDryRunStatus;
}
