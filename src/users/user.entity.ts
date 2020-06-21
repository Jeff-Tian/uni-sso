import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserAttribute } from './user-attribute.entity';
import { Credential } from './credential.entity';
import { ThirdPartyIdentity } from './third-party-identity.entity';

@Entity({
  name: 'public.user_entity',
})
export class User {
  // @ts-ignore
  @PrimaryGeneratedColumn({ type: 'character varying', length: 36 })
  id: string;

  @Column({ type: 'character varying', length: 255 })
  email: string;

  @Column({ type: 'boolean', name: 'email_verified' })
  emailVerified: string;

  @Column({ type: 'character varying', length: 255, name: 'first_name' })
  firstName: string;

  @Column({ type: 'character varying', length: 255, name: 'last_name' })
  lastName: string;

  @Column({ type: 'character varying', length: 255 })
  username: string;

  @Column({
    type: 'bigint',
    name: 'created_timestamp',
  })
  createdTimestamp: number;

  @Column({ default: true, type: 'boolean' })
  enabled: boolean;

  @OneToMany(
    type => UserAttribute,
    userAttr => userAttr.user_id,
  )
  userAttributes: UserAttribute[];

  @OneToMany(
    type => Credential,
    credential => credential.userId,
  )
  credentials: Credential[];

  @OneToMany(
    type => ThirdPartyIdentity,
    thirdPartyIdentity => thirdPartyIdentity.userId,
  )
  thirdPartyIdentities: ThirdPartyIdentity[];
}
