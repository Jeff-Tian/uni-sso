import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IEventCountryConfiguration, ICarrierServices, IScoringWeights } from '@hype/hype-shared';

@Entity()
@Index([ 'eventId', 'countryCode' ], { unique: true })
export class SQLCountryConfigurations implements IEventCountryConfiguration {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('uuid', { nullable: false })
  public eventId?: string;

  @Column('text', { nullable: false })
  @Index()
  public countryCode: string;

  @Column('text', { nullable: false })
  public currency: string;

  @Column('text', { nullable: false })
  @Index()
  public inventoryListId: string;

  @Column('text', { nullable: true })
  @Index()
  public secondaryInventoryListId?: string;

  @Column('float', { nullable: true })
  public maxRiskScore?: number;

  @Column('text', { array: true, nullable: false })
  public supportedPaymentMethodIds: Array<string>;

  @Column('jsonb', { nullable: false })
  public supportedCarrierServices: Array<ICarrierServices>;

  @Column('jsonb', { nullable: false, default: {} })
  public scoringWeights: IScoringWeights;

  @Column('float', { nullable: true })
  public cancelCutOffRate?: number;

  @Column('float', { nullable: true })
  public returnCutOffRate?: number;

  @Column('text', { nullable: true })
  public paymentValidationRiskProfileId?: string;

  @Column('text', { nullable: true })
  public checkoutRiskProfileId?: string;

  @Column('float', { nullable: true })
  public freeShippingThreshold?: number;

  @Column('float', { nullable: true })
  public shippingCosts?: number;
}
