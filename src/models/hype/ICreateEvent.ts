import { CreateEvent, EventRestrictionsType } from './Event';
import { EventSegment, Simulation } from '../../segmentation';

export interface ICreateEventRequestBodyParams extends CreateEvent {
  id: string;
  // People can view event
  eventOpensAt: Date;
  // Event is not available to view anymore
  eventClosesAt: Date;
  countdownStartsAt: Date;
  // Open registrations
  registrationOpensAt: Date;
  // Close registration
  registrationClosesAt: Date;
  extendedRegistrationEnabled: boolean;
  sendReminderNotificationAt?: Date;
  reminderNotificationsSent?: boolean;
  drawStartsAt: Date;
  drawEndedAt?: Date;
  requiresExtendedVerification?: boolean;
  pdpDrawMessageKey?: string;
  requiresBoostScore?: boolean;
  restrictions?: Array<ICreateEventRestriction>;
  loserNotificationStatus?: LoserNotificationStatus;
}

export interface ICreateEvent extends ICreateEventRequestBodyParams {
  createdAt?: Date;
  updatedAt?: Date;
  segments?: EventSegment[];
  segmentSimulation?: Simulation;
  lastSegmentSimulationCreationDate?: Date;
}

export interface ICreateEventRestriction {
  type: EventRestrictionsType;
}

export interface ICreateEventGeoRestriction extends ICreateEventRestriction {
  longitude: number;
  latitude: number;
  radius: number;
}

export enum LoserNotificationStatus {
  Started = 'started',
  Finished = 'finished'
}
