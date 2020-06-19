import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'public.user_entity',
})
export class User {
  @PrimaryGeneratedColumn()
  @Column({ type: 'varchar', length: 36 })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({type: 'boolean'})
  // tslint:disable-next-line:variable-name
  email_verified: string;

  @Column({type: 'varchar', length: 255})
  // tslint:disable-next-line:variable-name
  first_name: string;

  @Column({type: 'varchar', length: 255})
  // tslint:disable-next-line:variable-name
  last_name: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({
    type: 'bigint',
  })
  // tslint:disable-next-line:variable-name
  created_timestamp: number;

  @Column({ default: true, type: 'boolean' })
  enabled: boolean;
}
