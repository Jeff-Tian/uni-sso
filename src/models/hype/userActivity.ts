import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { UserActivity } from '@hype/hype-shared';

@Entity()
@Index([ 'userId' ], { unique: true })
export class SQLUserActivity implements UserActivity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    length: 40,
  })
  public userId: string;

  @Column('int', { nullable: false })
  public counter: number;

  @Column('timestamptz', { nullable: false })
  public updatedAt: Date;
}
