import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'public.user_entity',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
    // tslint:disable-next-line:variable-name
  email_verified: string;

  @Column()
    // tslint:disable-next-line:variable-name
  first_name: string;

  @Column()
    // tslint:disable-next-line:variable-name
  last_name: string;

  @Column()
  username: string;

  @Column()
    // tslint:disable-next-line:variable-name
  created_timestamp: Date;

  @Column({ default: true })
  enabled: boolean;
}
