import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'int', default: 0 })
  login_failed_times: number;

  @Column({ type: 'timestamptz', default: null })
  last_login_failed_at: Date;

  @Column({ type: 'timestamptz', default: 'Now()' })
  created_at: Date;
}