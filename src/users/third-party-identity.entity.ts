import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'public.federated_identity',
})
export class ThirdPartyIdentity {
  @Column({
    name: 'identity_provider',
    type: 'character varying',
    length: 255,
    nullable: false,
  })
  @PrimaryColumn()
  identityProvider: string;

  @Column({
    name: 'user_id',
    type: 'character varying',
    length: 36,
    nullable: false,
  })
  @PrimaryColumn()
  userId: string;

  @Column({
    name: 'federated_user_id',
    type: 'character varying',
    length: 255,
    nullable: true,
  })
  thirdPartyUserId: string;

  @Column({
    name: 'federated_username',
    type: 'character varying',
    length: 255,
    nullable: true,
  })
  thirdPartyUserName: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  token: string;
}
