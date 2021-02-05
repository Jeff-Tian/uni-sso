import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DefaultMessages } from '@hype/hype-shared';

@Entity()
@Index([ 'key' ], { unique: true })
export class SQLDefaultMessages implements DefaultMessages {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text', { nullable: false })
  public key: string;

  @Column('text', { nullable: true })
  public defaultMessage?: string;

  @Column('jsonb', { nullable: false, default: {} })
  public translations: { [locale: string]: string };

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
