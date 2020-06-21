import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserAttribute } from './user-attribute.entity';

@Entity({
  name: 'public.user_entity',
})
export class User {
  // @ts-ignore
  @PrimaryGeneratedColumn({ type: 'character varying', length: 36 })
  id: string;

  @Column({ type: 'character varying', length: 255 })
  email: string;

  @Column({ type: 'boolean' })
  // tslint:disable-next-line:variable-name
  email_verified: string;

  @Column({ type: 'character varying', length: 255 })
  // tslint:disable-next-line:variable-name
  first_name: string;

  @Column({ type: 'character varying', length: 255 })
  // tslint:disable-next-line:variable-name
  last_name: string;

  @Column({ type: 'character varying', length: 255 })
  username: string;

  @Column({
    type: 'bigint',
  })
  // tslint:disable-next-line:variable-name
  created_timestamp: number;

  @Column({ default: true, type: 'boolean' })
  enabled: boolean;

  // @OneToMany(
  //   type => UserAttribute,
  //   userAttr => userAttr.user_id,
  // )
  // userAttributes: UserAttribute[];
}
