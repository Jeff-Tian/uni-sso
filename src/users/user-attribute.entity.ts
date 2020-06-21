import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'public.user_attribute',
})
export class UserAttribute {
  @PrimaryGeneratedColumn()
  @Column({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  value: string;

  @Column({ type: 'varchar', length: 255 })
    // tslint:disable-next-line:variable-name
  user_id: string;
}
