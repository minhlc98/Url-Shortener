import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Url {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  hash: string;

  @Column({ type: 'varchar', length: 255 })
  original_url: string;

  @Column({ type: 'varchar', length: 50 })
  hash_original_url: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'integer', default: 0 })
  visited_count: number;

  @Column({ type: 'timestamp', default: null })
  last_visited_at: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;
}
