import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserAttribute } from './user-attribute.entity';

@Entity({
  name: 'public.credential',
})
export class Credential {
  // @ts-ignore
  @PrimaryGeneratedColumn({ type: 'character varying', length: 36 })
  id: string;

  @Column({ type: 'bytea' })
  slat: string;

  @Column({ type: 'character varying', length: 255, nullable: true })
  type: string;

  @Column({
    type: 'character varying',
    length: 36,
    nullable: true,
    name: 'user_id',
  })
  userId: string;

  @Column({
    type: 'bigint',
    nullable: true,
    name: 'created_date',
  })
  createdDate: Date;

  @Column({
    type: 'character varying',
    length: 255,
    nullable: true,
    name: 'user_label',
  })
  userLabel: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'secret_data',
  })
  secretData: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'credential_data',
  })
  credentialData: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  priority: number;
}
