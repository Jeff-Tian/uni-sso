import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'public.user_attribute',
})
export class UserAttribute {
  // @ts-ignore
  @PrimaryGeneratedColumn({ type: 'character varying', length: 36 })
  id: string;

  @Column({ type: 'character varying', length: 255 })
  name: string;

  @Column({ type: 'character varying', length: 255 })
  value: string;

  @Column({ type: 'character varying', length: 36 })
    // tslint:disable-next-line:variable-name
  user_id: string;
}
